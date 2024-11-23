import { MockBuilder, MockInstance, MockRender, MockService, ngMocks } from 'ng-mocks';
import { ProjectSelectorComponent } from './project-selector.component';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { EMPTY, Subject } from 'rxjs';
import { ProjectService } from '../../services/project.service';
import { signal } from '@angular/core';
import { Project } from '../../models/project.model';

describe('ProjectSelectorComponent', () => {
  ngMocks.faster();
  MockInstance.scope();

  beforeAll(() => MockBuilder(ProjectSelectorComponent)
    .mock(ProjectService, { projects: signal([]) })
    .mock(Location, { path: () => '/' })
    .mock(Router, {
      events: EMPTY,
      navigate: () => Promise.resolve(true),
    }));

  const render = (): ProjectSelectorComponent =>
    MockRender(ProjectSelectorComponent).point.componentInstance;

  it('should be created', () => {
    expect(render()).toBeTruthy();
  });

  it('should get loaded projects from project service', () => {
    const projects: Project[] = [{ id: '15424e6e-6a3f-47d3-9b54-ace8f3e292ca', name: 'Test', dbType: 'oracle' }];
    MockInstance(ProjectService, 'projects', signal(projects));

    const component = render();

    expect(component.projects()).toEqual(projects);
  });

  it('should preselect current project id', () => {
    MockInstance(Location, 'path', () => '/project/fb0fa860-ac7c-4564-925c-167c7d93965d');
    const component = render();
    expect(component.selectControl.getRawValue()).toEqual('fb0fa860-ac7c-4564-925c-167c7d93965d');
  });

  it('should not preselect project when project is not selected in navigation', () => {
    MockInstance(Location, 'path', () => '/other/route');
    const component = render();
    expect(component.selectControl.getRawValue()).toBeNull();
  });

  it('should update selection on navigation', () => {
    let path = '/project/4159e90c-1035-479d-bc38-dd13d1c74ae1';
    MockInstance(Location, 'path', () => path);

    const navigationEvents$ = new Subject<NavigationEnd>();
    MockInstance(Router, 'events', navigationEvents$.asObservable());

    const component = render();
    expect(component.selectControl.getRawValue()).toEqual('4159e90c-1035-479d-bc38-dd13d1c74ae1');

    path = '/project';
    navigationEvents$.next(MockService(NavigationEnd));
    expect(component.selectControl.getRawValue()).toBeNull();

    path = '/project/1343adcf-92b4-4825-ae27-ed496349b312';
    navigationEvents$.next(MockService(NavigationEnd));
    expect(component.selectControl.getRawValue()).toEqual('1343adcf-92b4-4825-ae27-ed496349b312');
  });

  it('should navigate to selected project', () => {
    const navigateSpy = jest.fn(() => Promise.resolve(true));
    MockInstance(Router, 'navigate', navigateSpy);

    render().onSelectionChange('fa79bc07-8bd1-4d8c-8383-2f31d8506f8b');

    expect(navigateSpy).toHaveBeenCalledWith(['/project', 'fa79bc07-8bd1-4d8c-8383-2f31d8506f8b'])
  });
});
