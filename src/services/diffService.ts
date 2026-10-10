export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  originalLineNumber?: number;
  repairedLineNumber?: number;
}

/**
 * Computes a line-by-line diff between two text documents
 * using longest common subsequence (LCS) approach for accurate line matching.
 */
export function computeLineDiff(originalText: string, repairedText: string): DiffLine[] {
  const originalLines = originalText.split('\n');
  const repairedLines = repairedText.split('\n');

  const n = originalLines.length;
  const m = repairedLines.length;

  // For very large documents (>2000 lines), perform a fast windowed diff to avoid memory spikes
  if (n * m > 2000000) {
    return computeFastDiff(originalLines, repairedLines);
  }

  // Standard LCS DP Table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (originalLines[i] === repairedLines[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to assemble diff
  const diff: DiffLine[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && originalLines[i - 1] === repairedLines[j - 1]) {
      diff.unshift({
        type: 'unchanged',
        content: originalLines[i - 1],
        originalLineNumber: i,
        repairedLineNumber: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({
        type: 'added',
        content: repairedLines[j - 1],
        repairedLineNumber: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({
        type: 'removed',
        content: originalLines[i - 1],
        originalLineNumber: i,
      });
      i--;
    }
  }

  return diff;
}

function computeFastDiff(originalLines: string[], repairedLines: string[]): DiffLine[] {
  const diff: DiffLine[] = [];
  const max = Math.max(originalLines.length, repairedLines.length);

  for (let idx = 0; idx < max; idx++) {
    const orig = originalLines[idx];
    const rep = repairedLines[idx];

    if (orig === rep && orig !== undefined) {
      diff.push({
        type: 'unchanged',
        content: orig,
        originalLineNumber: idx + 1,
        repairedLineNumber: idx + 1,
      });
    } else {
      if (orig !== undefined) {
        diff.push({
          type: 'removed',
          content: orig,
          originalLineNumber: idx + 1,
        });
      }
      if (rep !== undefined) {
        diff.push({
          type: 'added',
          content: rep,
          repairedLineNumber: idx + 1,
        });
      }
    }
  }

  return diff;
}

/**
 * Filter diff to only show regions around changes (hunks) with configurable context lines.
 */
export function getDiffHunks(diff: DiffLine[], contextLines: number = 3): DiffLine[] {
  const hasChanges = diff.some((d) => d.type !== 'unchanged');
  if (!hasChanges) {
    return diff.slice(0, 10); // Show top 10 lines if identical
  }

  const indicesWithChanges = new Set<number>();
  diff.forEach((line, idx) => {
    if (line.type !== 'unchanged') {
      for (let offset = -contextLines; offset <= contextLines; offset++) {
        const target = idx + offset;
        if (target >= 0 && target < diff.length) {
          indicesWithChanges.add(target);
        }
      }
    }
  });

  return diff.filter((_, idx) => indicesWithChanges.has(idx));
}
