import { stripFileExtension } from './stripFileExtension.js';

describe('stripFileExtension', () => {
  it('should remove the last extension when no specific extension is provided', () => {
    const result = stripFileExtension('example.txt');
    expect(result).to.equal('example');
  });

  it('should remove the specified extension if it matches', () => {
    const result = stripFileExtension('example.txt', '.txt');
    expect(result).to.equal('example');
  });

  it('should not remove the extension if the specified extension does not match', () => {
    const result = stripFileExtension('example.txt', '.doc');
    expect(result).to.equal('example.txt');
  });

  it('should return the same filename if there is no extension', () => {
    const result = stripFileExtension('example');
    expect(result).to.equal('example');
  });

  it('should return an empty string if the input is an empty string', () => {
    const result = stripFileExtension('');
    expect(result).to.equal('');
  });

  it('should handle filenames with leading dots correctly', () => {
    const result = stripFileExtension('.example');
    expect(result).to.equal('.example');
  });

  it('should handle filenames with multiple extensions correctly', () => {
    const result = stripFileExtension('example.tar.gz');
    expect(result).to.equal('example.tar');
  });

  it('should remove the specified extension from filenames with multiple extensions', () => {
    const result = stripFileExtension('example.tar.gz', '.gz');
    expect(result).to.equal('example.tar');
  });

  it(
    'should not remove the extension if the specified extension does not match in filenames with multiple extensions',
    () => {
      const result = stripFileExtension('example.tar.gz', '.zip');
      expect(result).to.equal('example.tar.gz');
    });
});
