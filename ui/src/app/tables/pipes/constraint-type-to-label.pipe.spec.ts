import { ConstraintTypeToLabelPipe } from './constraint-type-to-label.pipe';
import { TableConstraintType } from '../models/table-constraint.model';

describe('ConstraintTypeToLabelPipe', () => {
  let pipe: ConstraintTypeToLabelPipe;

  beforeEach(() => {
    pipe = new ConstraintTypeToLabelPipe();
  });

  it('create be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform primary key type to label', () => {
    expect(pipe.transform(TableConstraintType.PRIMARY_KEY)).toEqual('TABLES.CONSTRAINTS.TYPE.PRIMARY_KEY');
  });

  it('should transform foreign key type to label', () => {
    expect(pipe.transform(TableConstraintType.FOREIGN_KEY)).toEqual('TABLES.CONSTRAINTS.TYPE.FOREIGN_KEY');
  });

  it('should transform unique type to label', () => {
    expect(pipe.transform(TableConstraintType.UNIQUE)).toEqual('TABLES.CONSTRAINTS.TYPE.UNIQUE');
  });

  it('should transform check type to label', () => {
    expect(pipe.transform(TableConstraintType.CHECK)).toEqual('TABLES.CONSTRAINTS.TYPE.CHECK');
  });
});
