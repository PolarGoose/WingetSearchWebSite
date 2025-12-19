import { execa } from 'execa';

export async function cloneRepositoryShallow(repositoryUrl: string, destinationPath: string): Promise<void> {
  const res = await execa('git', ['clone', '--depth', '1', repositoryUrl, destinationPath], {
    all: true,
    reject: false,
  });
  if (res.exitCode !== 0) {
    throw new Error(`git clone failed: repositoryUrl='${repositoryUrl}' destinationPath='${destinationPath}' ExitCode=${res.exitCode}\nOutput:\n${res.all}`);
  }
}
