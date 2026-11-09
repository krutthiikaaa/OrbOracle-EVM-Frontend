/**
 * Governance constants and helper functions matching GovernanceLib.sol
 * in the smart contracts.
 */

// Denominator used across governance calculations in the contract (100,000)
export const GOVERNANCE_DENOMINATOR = 100000

// Scaling factor between percentage (0-100) and contract scale (0-100000)
export const QUORUM_SCALE = GOVERNANCE_DENOMINATOR / 100 // 1000

/**
 * Converts a quorum percentage string or number (0-100) into the contract's
 * scaled integer representation `q` based on DENOMINATOR = 100000.
 *
 * Examples:
 * 1%   -> 1000n
 * 2%   -> 2000n
 * 10%  -> 10000n
 * 20%  -> 20000n
 * 50%  -> 50000n
 * 100% -> 100000n
 */
export function percentToQuorum(percent: number | string): bigint {
  const num = typeof percent === 'string' ? Number(percent || 0) : percent
  return BigInt(Math.round((num * GOVERNANCE_DENOMINATOR) / 100))
}

/**
 * Converts the contract's scaled integer `q` (based on DENOMINATOR = 100000)
 * to a percentage number (0-100).
 *
 * Examples:
 * 1000   -> 1
 * 2000   -> 2
 * 10000  -> 10
 * 20000  -> 20
 * 50000  -> 50
 * 100000 -> 100
 */
export function quorumToPercent(quorum: bigint | number): number {
  const num = typeof quorum === 'bigint' ? Number(quorum) : quorum
  return (num * 100) / GOVERNANCE_DENOMINATOR
}

/**
 * Formats the contract's scaled integer `q` as a user-friendly percentage string.
 *
 * Examples:
 * 1000   -> "1%"
 * 2000   -> "2%"
 * 10000  -> "10%"
 * 20000  -> "20%"
 * 50000  -> "50%"
 * 100000 -> "100%"
 */
export function formatQuorumPercentage(quorum: bigint | number): string {
  const pct = quorumToPercent(quorum)
  return `${parseFloat(pct.toFixed(3))}%`
}

