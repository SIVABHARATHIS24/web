import type { Patient, StaffMember, Visit } from '../../types'

export type CloudStatus = 'unconfigured' | 'connecting' | 'signed_out' | 'synced' | 'error'

export interface CloudCallbacks {
  onStatus: (status: CloudStatus) => void
  onStaff: (me: StaffMember | null) => void
  onPatients: (items: Patient[]) => void
  onVisits: (items: Visit[]) => void
  onStaffList: (items: StaffMember[]) => void
}
