import { inject, Injectable } from '@angular/core';
import { toCanvas } from 'html-to-image';
import { defer, finalize, from, mergeMap, Observable, of, throwError } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { canvasToBlob } from 'html-to-image/es/util';

export interface DiagramExportOptions {
  format: 'image/png' | 'image/jpeg';
  transparent?: boolean;
  quality?: number;
  additionalClasses: string[];
}

@Injectable({ providedIn: 'root' })
export class DiagramExportService {

  private document = inject(DOCUMENT);

  exportDiagram(diagramRoot: HTMLElement, { format, transparent, quality, additionalClasses }: DiagramExportOptions): Observable<Blob> {
    return defer(() => of(diagramRoot.cloneNode(true) as HTMLElement)).pipe(mergeMap(rootCopy => {
      const wrapper: HTMLDivElement = this.document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.appendChild(rootCopy);
      this.document.body.appendChild(wrapper);

      const diagramSvg = rootCopy.querySelector('.djs-parent > svg') as SVGElement;
      const viewport = diagramSvg.querySelector('g.viewport') as SVGGraphicsElement;
      viewport.setAttribute('transform', '');

      const { width, height } = viewport.getBoundingClientRect();
      wrapper.style.width = diagramSvg.style.width = `${width}px`;
      wrapper.style.height = diagramSvg.style.height = `${height}px`;
      wrapper.style.left = `${-width * 2}px`;
      wrapper.style.top = `${-height * 2}px`;

      additionalClasses.forEach(c => rootCopy.classList.add(c));

      if (transparent) {
        rootCopy.classList.add('transparent');
      }

      // https://github.com/bubkoo/html-to-image/issues/458
      return from(toCanvas(rootCopy)).pipe(
        mergeMap(canvas => from(canvasToBlob(canvas, { type: format, quality })).pipe(
          mergeMap(blob =>
            blob !== null
              ? of(blob)
              : throwError(() => new Error(`Failed to export diagram to '${format}'.`))
          ),
          finalize(() => canvas.remove()),
        )),
        finalize(() => wrapper.remove()),
      );
    }));
  }

}
