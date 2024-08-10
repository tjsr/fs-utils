export const stripFileExtension = (inputFilename: string, extension?: string): string => {
  if (extension == undefined || extension == null) {
    const lastIndex = inputFilename?.lastIndexOf(".");
    if (lastIndex > 0) {
      return inputFilename.slice(0, lastIndex);
    }
    return inputFilename;
  }

  const checkExtension: string = extension!.startsWith(".") ? extension! : `.${extension}`;

  if (inputFilename?.endsWith(checkExtension)) {
    return inputFilename.slice(0, 0 - checkExtension.length);
  }
  return inputFilename;
};
