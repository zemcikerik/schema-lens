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
      const wrapper = this.wrapWithAbsolutePositionedWrapper(rootCopy);
      const diagramSvg = rootCopy.querySelector('.djs-parent > svg') as SVGElement;
      const viewport = diagramSvg.querySelector('g.viewport') as SVGGraphicsElement;

      this.resetDiagramOffsetAndZoom(viewport);
      this.moveWrapperOutOfViewAndFitDiagram(wrapper, viewport);
      this.fixViewportPositioningWithNegativeCoordinates(viewport);
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

  private wrapWithAbsolutePositionedWrapper(rootCopy: HTMLElement): HTMLElement {
    const wrapper: HTMLDivElement = this.document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.appendChild(rootCopy);
    this.document.body.appendChild(wrapper);
    return wrapper;
  }

  private resetDiagramOffsetAndZoom(viewport: SVGGraphicsElement): void {
    viewport.setAttribute('transform', '');
  }

  private moveWrapperOutOfViewAndFitDiagram(wrapper: HTMLElement, viewport: SVGGraphicsElement): void {
    const { width, height } = viewport.getBoundingClientRect();
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.style.left = `${-width * 2}px`;
    wrapper.style.top = `${-height * 2}px`;
  }

  private fixViewportPositioningWithNegativeCoordinates(viewport: SVGGraphicsElement): void {
    const { x, y } = viewport.getBBox();
    viewport.setAttribute('transform', `translate(${-x}, ${-y})`);
  }
}
