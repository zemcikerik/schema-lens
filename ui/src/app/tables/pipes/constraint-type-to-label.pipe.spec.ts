import { ConstraintTypeToLabelPipe } from './constraint-type-to-label.pipe';

describe('ConstraintTypeToLabelPipe', () => {
  let pipe: ConstraintTypeToLabelPipe;

  beforeEach(() => {
    pipe = new ConstraintTypeToLabelPipe();
  });

  it('create be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform primary key type to label', () => {
    expect(pipe.transform('primary-key')).toEqual('TABLES.CONSTRAINTS.TYPE.PRIMARY-KEY');
  });

  it('should transform foreign key type to label', () => {
    expect(pipe.transform('foreign-key')).toEqual('TABLES.CONSTRAINTS.TYPE.FOREIGN-KEY');
  });

  it('should transform unique type to label', () => {
    expect(pipe.transform('unique')).toEqual('TABLES.CONSTRAINTS.TYPE.UNIQUE');
  });

  it('should transform check type to label', () => {
    expect(pipe.transform('check')).toEqual('TABLES.CONSTRAINTS.TYPE.CHECK');
  });
});
