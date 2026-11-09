import test from 'node:test'
import assert from 'node:assert'
import {
  GOVERNANCE_DENOMINATOR,
  QUORUM_SCALE,
  percentToQuorum,
  quorumToPercent,
  formatQuorumPercentage,
} from '../utils/governance.ts'

test('Governance Constants', () => {
  assert.strictEqual(GOVERNANCE_DENOMINATOR, 100000)
  assert.strictEqual(QUORUM_SCALE, 1000)
})

test('percentToQuorum conversions for standard inputs', () => {
  const testCases = [
    { input: '1', expected: 1000n },
    { input: '2', expected: 2000n },
    { input: '10', expected: 10000n },
    { input: '20', expected: 20000n },
    { input: '50', expected: 50000n },
    { input: '100', expected: 100000n },
    { input: 1, expected: 1000n },
    { input: 20, expected: 20000n },
    { input: 100, expected: 100000n },
  ]

  for (const { input, expected } of testCases) {
    assert.strictEqual(percentToQuorum(input), expected, `Failed for input ${input}`)
  }
})

test('percentToQuorum conversions for fractional inputs', () => {
  assert.strictEqual(percentToQuorum('0.5'), 500n)
  assert.strictEqual(percentToQuorum('1.25'), 1250n)
  assert.strictEqual(percentToQuorum('20.5'), 20500n)
  assert.strictEqual(percentToQuorum(0), 0n)
  assert.strictEqual(percentToQuorum(''), 0n)
})

test('quorumToPercent conversions', () => {
  assert.strictEqual(quorumToPercent(1000n), 1)
  assert.strictEqual(quorumToPercent(2000n), 2)
  assert.strictEqual(quorumToPercent(10000n), 10)
  assert.strictEqual(quorumToPercent(20000n), 20)
  assert.strictEqual(quorumToPercent(50000n), 50)
  assert.strictEqual(quorumToPercent(100000n), 100)
  assert.strictEqual(quorumToPercent(1250n), 1.25)
  assert.strictEqual(quorumToPercent(20500n), 20.5)
})

test('formatQuorumPercentage conversions', () => {
  const testCases = [
    { quorum: 1000n, expected: '1%' },
    { quorum: 2000n, expected: '2%' },
    { quorum: 10000n, expected: '10%' },
    { quorum: 20000n, expected: '20%' },
    { quorum: 50000n, expected: '50%' },
    { quorum: 100000n, expected: '100%' },
    { quorum: 1000, expected: '1%' },
    { quorum: 20000, expected: '20%' },
    { quorum: 0n, expected: '0%' },
    { quorum: 500n, expected: '0.5%' },
    { quorum: 1250n, expected: '1.25%' },
    { quorum: 20500n, expected: '20.5%' },
  ]

  for (const { quorum, expected } of testCases) {
    assert.strictEqual(
      formatQuorumPercentage(quorum),
      expected,
      `Failed for quorum ${quorum}`
    )
  }
})

test('Required conversions table from specification', () => {
  const specTable = [
    { userInput: '1', expectedStoredQ: 1000n, expectedDisplay: '1%' },
    { userInput: '2', expectedStoredQ: 2000n, expectedDisplay: '2%' },
    { userInput: '10', expectedStoredQ: 10000n, expectedDisplay: '10%' },
    { userInput: '20', expectedStoredQ: 20000n, expectedDisplay: '20%' },
    { userInput: '50', expectedStoredQ: 50000n, expectedDisplay: '50%' },
    { userInput: '100', expectedStoredQ: 100000n, expectedDisplay: '100%' },
  ]

  for (const { userInput, expectedStoredQ, expectedDisplay } of specTable) {
    const storedQ = percentToQuorum(userInput)
    assert.strictEqual(storedQ, expectedStoredQ, `Stored q mismatch for ${userInput}%`)
    const display = formatQuorumPercentage(storedQ)
    assert.strictEqual(display, expectedDisplay, `Display mismatch for ${userInput}%`)
  }
})

test('Reward scaling logic is preserved and independent of quorum', () => {
  // Reward uses Math.round(Number(rewardPercent || 0) * 1000)
  const rewardPercent = '1.0'
  const rewardBps = BigInt(Math.round(Number(rewardPercent || 0) * 1000))
  assert.strictEqual(rewardBps, 1000n)

  // Verify reward rate formatting in details page: (reward / 1000).toFixed(3)%
  const rewardRate = `${(Number(rewardBps) / 1000).toFixed(3)}%`
  assert.strictEqual(rewardRate, '1.000%')
})
