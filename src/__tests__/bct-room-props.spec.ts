/**
 * BCT-PROPS-*: Room Props Tests (P6-ART-PROPS)
 *
 * Tests that RoomProps component exists and exports correctly.
 * Visual rendering is verified via manual QA and integration tests.
 *
 * @see docs/GRUNDY_MASTER_BIBLE.md §14.4
 */
import { describe, it, expect } from 'vitest';
import { RoomProps } from '../components/environment/RoomProps';

describe('BCT-PROPS-01: RoomProps component exists (P6-ART-PROPS)', () => {
  it('RoomProps component is exported', () => {
    expect(RoomProps).toBeDefined();
    expect(typeof RoomProps).toBe('function');
  });
});
