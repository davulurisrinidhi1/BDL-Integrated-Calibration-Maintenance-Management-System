export const MOCK_INSTRUMENT_TASKS = [
  { id: 'IT-001', code: 'VC001', stc: 'CAL', group: 'INST-GRP', ctr: '10', description: 'Check zero error', pht: '0.1', det: '0.05', strategy: 'SM' },
  { id: 'IT-002', code: 'VC001', stc: 'CAL', group: 'INST-GRP', ctr: '20', description: 'Full scale calibration', pht: '0.5', det: '0.2', strategy: 'PM' },
  { id: 'IT-003', code: 'OM001', stc: 'CAL', group: 'INST-GRP', ctr: '10', description: 'Anvil flatness check', pht: '0.2', det: '0.1', strategy: 'SM' }
];

export const MOCK_INSTRUMENT_STRATEGIES = [
  { id: 'IS-001', code: 'VC001', type: 'SM', action: 'Visual inspection and zero check', frequency: '3-monthly' },
  { id: 'IS-002', code: 'VC001', type: 'PM', action: 'Full master calibration', frequency: 'Yearly' },
  { id: 'IS-003', code: 'OM001', type: 'SM', action: 'Zero check and minor cleaning', frequency: '3-monthly' }
];
