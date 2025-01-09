import { ProjectObjectNavHostComponent } from './project-object-nav-host.component';
import { MockBuilder, MockInstance, MockRender, MockService, ngMocks } from 'ng-mocks';
import { ProjectObjectDefinition, ProjectObjectNavService } from '../../services/project-object-nav.service';
import { EMPTY } from 'rxjs';
import { ProjectObjectSelectorComponent } from '../project-object-selector/project-object-selector.component';
import { TranslatePipe } from '../../../core/translate/translate.pipe';
import { signal } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';

describe('ProjectObjectNavHostComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => MockBuilder(ProjectObjectNavHostComponent)
    .mock(MatDialog, {
      open: () => null as any,
    })
    .mock(ProjectObjectNavService, {
      getObjectDefinitionsFor: () => [],
    })
    .mock(TranslatePipe, v => signal(v)));

  beforeEach(() => {
    // https://github.com/help-me-mom/ng-mocks/issues/8634
    MockInstance(ProjectObjectSelectorComponent, 'expansionPanel', signal(MockService(MatExpansionPanel)));
  });

  const render = (projectId: string): ProjectObjectNavHostComponent => {
    const fixture = MockRender(ProjectObjectNavHostComponent, { projectId });
    return fixture.point.componentInstance;
  };

  it('should be created', () => {
    expect(render('67c6dcd4-5d50-42df-82ca-8576390a3c97')).toBeTruthy();
  });

  it('should get object definitions for a given project', () => {
    const projectId = '02f5681b-0c5e-4241-b9ff-86275e520408';
    const getObjectDefinitionsForSpy = jest.fn((): ProjectObjectDefinition[] => [
      { id: 'object', baseRouterLink: [], titleTranslationKey: '', objectLoadAction: () => EMPTY },
    ]);
    MockInstance(ProjectObjectNavService, 'getObjectDefinitionsFor', getObjectDefinitionsForSpy);

    const component = render(projectId);

    expect(component.objectDefinitions()).toHaveLength(1);
    expect(component.objectDefinitions()[0].id).toEqual('object');
    expect(getObjectDefinitionsForSpy).toHaveBeenCalledWith(projectId);
  });

  it('should render object selector for each object definition', () => {
    MockInstance(ProjectObjectNavService, 'getObjectDefinitionsFor', (): ProjectObjectDefinition[] => [
      { id: 'table', baseRouterLink: [], titleTranslationKey: '', objectLoadAction: () => EMPTY },
      { id: 'view', baseRouterLink: [], titleTranslationKey: '', objectLoadAction: () => EMPTY },
      { id: 'trigger', baseRouterLink: [], titleTranslationKey: '', objectLoadAction: () => EMPTY },
    ]);
    render('72997912-c96a-44fc-b4c5-bf93eefcbe57');
    expect(ngMocks.findAll(ProjectObjectSelectorComponent)).toHaveLength(3);
  });
});
