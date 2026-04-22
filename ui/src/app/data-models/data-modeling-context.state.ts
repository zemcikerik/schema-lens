import { computed, inject, Injectable } from '@angular/core';
import { RouteDataService } from '../core/routing/route-data.service';
import { RouteData } from '../core/models/route-data.model';
import { Router } from '@angular/router';

export type DataModelingLayer = 'logical' | 'physical' | 'unknown';
export type DataModelingContext = 'logical' | 'oracle' | 'unknown';
type SwitchableDataModelingContext = Exclude<DataModelingContext, 'unknown'>;

interface ContextRouteMapper {
  pattern: RegExp;
  map(match: RegExpExecArray, context: SwitchableDataModelingContext): string[] | null;
}

@Injectable({ providedIn: 'root' })
export class DataModelingContextState {
  private routeData = inject(RouteDataService).routeData;
  private router = inject(Router);

  context = computed<DataModelingContext>(() => {
    const data = this.routeData() as RouteData & { dataModelingContext?: DataModelingContext };
    return data.dataModelingContext ?? 'unknown';
  });

  layer = computed<DataModelingLayer>(() => {
    const context = this.context();
    return context === 'oracle' ? 'physical' : context;
  });

  private readonly contextRouteMappers: ContextRouteMapper[] = [
    {
      pattern: /^\/model\/([^/]+)\/(logical|oracle)\/properties$/,
      map: (match, context) => ['/model', match[1], context, 'properties'],
    },
    {
      pattern: /^\/model\/([^/]+)\/(logical|oracle)\/(domain|data-type)\/([^/]+)$/,
      map: (match, context) => ['/model', match[1], context, this.mapDataTypeSegment(context), match[4]],
    },
    {
      pattern: /^\/model\/([^/]+)\/(logical|oracle)\/(entity|table)\/([^/]+)$/,
      map: (match, context) => ['/model', match[1], context, this.mapNodeSegment(context), match[4]],
    },
  ];

  async switchToContext(context: DataModelingContext): Promise<void> {
    if (this.context() === 'unknown' || this.context() === context) {
      return;
    }

    if (context === 'unknown') {
      throw new Error('Cannot switch to unknown context');
    }

    const currentPath = this.router.url;
    const commands = this.findContextSwitchCommands(currentPath, context);

    if (commands) {
      await this.router.navigate(commands);
      return;
    }

    const dataModelId = this.extractDataModelId(currentPath);

    if (!dataModelId) {
      throw new Error(`Cannot resolve data model id from current route: ${currentPath}`);
    }

    await this.router.navigate(['/model', dataModelId, context]);
  }

  private findContextSwitchCommands(path: string, targetContext: SwitchableDataModelingContext): string[] | null {
    for (const mapper of this.contextRouteMappers) {
      const match = mapper.pattern.exec(path);

      if (match) {
        return mapper.map(match, targetContext);
      }
    }

    return null;
  }

  private mapNodeSegment(context: SwitchableDataModelingContext): 'entity' | 'table' {
    return context === 'logical' ? 'entity' : 'table';
  }

  private mapDataTypeSegment(context: SwitchableDataModelingContext): 'domain' | 'data-type' {
    return context === 'logical' ? 'domain' : 'data-type';
  }

  private extractDataModelId(path: string): string | null {
    const dataModelRouteMatch = /^\/model\/([^/]+)/.exec(path);
    return dataModelRouteMatch ? dataModelRouteMatch[1] : null;
  }
}
