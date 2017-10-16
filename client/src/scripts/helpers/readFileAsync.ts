export function readFileAsync(file: File): Promise<string>;
export function readFileAsync(file: File, options: 'utf8'): Promise<string>;
export function readFileAsync(file: File, options: string): Promise<ArrayBuffer>;
export async function readFileAsync(file: File, options: string = 'utf8') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('error', reject);
    reader.addEventListener('abort', reject);
    reader.addEventListener('load', () => resolve(reader.result));

    if (options !== 'utf8') {
      return reader.readAsArrayBuffer(file);
    }
    return reader.readAsText(file);
  }) as Promise<string | ArrayBuffer>;
}

export default readFileAsync;
