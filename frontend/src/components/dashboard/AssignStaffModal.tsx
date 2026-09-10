import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAssignStaff, useStaffMembers } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../services/api';
import { AlertBanner } from '../ui/Toast';
import { UserCheck, Users } from 'lucide-react';

export interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  currentStaffId?: number | null;
  currentStaffName?: string | null;
  onSuccess?: () => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  isOpen,
  onClose,
  orderId,
  currentStaffId,
  currentStaffName,
  onSuccess,
}) => {
  const { tenantId, tenantName } = useAuth();
  const { data: staffMembers = [], isLoading: isLoadingStaff } = useStaffMembers(isOpen);
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    currentStaffId ? currentStaffId.toString() : ''
  );
  const [staffUsernameInput, setStaffUsernameInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const assignStaffMutation = useAssignStaff();

  // Reset or sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null);
      if (currentStaffId) {
        setSelectedStaffId(currentStaffId.toString());
      } else {
        setSelectedStaffId('');
      }
      setStaffUsernameInput(currentStaffName || '');
    }
  }, [isOpen, currentStaffId, currentStaffName]);

  // When dropdown selection changes, update the username input
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStaffId(value);

    const matched = staffMembers.find((m) => m.id.toString() === value);
    if (matched) {
      setStaffUsernameInput(matched.username);
    } else if (!value) {
      setStaffUsernameInput('');
    }
  };

  // When typing a username directly, auto-select if it matches a known staff member
  const handleUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStaffUsernameInput(val);

    const trimmed = val.trim().toLowerCase().replace(/^@/, '');
    const matched = staffMembers.find(
      (m) => m.username.toLowerCase() === trimmed || m.id.toString() === trimmed
    );
    if (matched) {
      setSelectedStaffId(matched.id.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedUsername = staffUsernameInput.trim().replace(/^@/, '');
    const parsedId = selectedStaffId ? parseInt(selectedStaffId, 10) : undefined;

    if (!parsedId && !cleanedUsername) {
      setError('Please select a staff member from the dropdown or enter a staff username.');
      return;
    }

    try {
      await assignStaffMutation.mutateAsync({
        id: orderId,
        staffId: parsedId,
        username: cleanedUsername || undefined,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Staff to Order"
      description="Select from your registered store staff members or enter their username."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertBanner type="error" message={error} onClose={() => setError(null)} />}

        {currentStaffName && (
          <div className="p-3 bg-[#F7F7F5] border border-[#E7E7E3] rounded-xl text-xs text-[#6F6F6B] flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#111111] shrink-0" />
            <span>
              Currently Assigned: <strong className="text-[#111111]">{currentStaffName}</strong>
              {currentStaffId && <span className="font-mono text-[11px] text-[#999994] ml-1">(ID: {currentStaffId})</span>}
            </span>
          </div>
        )}

        {/* Staff Members Dropdown */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#6F6F6B]">
            Select Staff Member from Store
          </label>
          <div className="relative">
            <select
              value={selectedStaffId}
              onChange={handleDropdownChange}
              disabled={isLoadingStaff || staffMembers.length === 0}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E7E7E3] rounded-xl text-[#111111] focus:border-[#111111] focus:ring-1 focus:ring-[#111111] focus:outline-none transition-colors disabled:bg-[#F7F7F5] disabled:text-[#999994]"
            >
              <option value="">
                {isLoadingStaff
                  ? 'Loading staff members...'
                  : staffMembers.length === 0
                  ? 'No staff members registered in this store'
                  : '-- Choose a staff member --'}
              </option>
              {staffMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.full_name} (@{member.username}) — ID: {member.id}
                </option>
              ))}
            </select>
          </div>
          {staffMembers.length === 0 && !isLoadingStaff && (
            <p className="text-[11px] text-[#8E8E89] mt-1">
              No staff registered yet for {tenantName || 'your store'}. Share your Store ID{' '}
              <strong className="text-[#111111] font-mono">{tenantId}</strong> with staff to register.
            </p>
          )}
        </div>

        {/* Alternative: Enter Staff Username or ID */}
        <div className="pt-1">
          <Input
            label="Staff Username or ID"
            type="text"
            placeholder="e.g. satya or staff_user"
            value={staffUsernameInput}
            onChange={handleUsernameInputChange}
            helperText="Selecting from the dropdown above auto-fills this, or type any registered staff username directly."
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E7E7E3]">
          <div className="text-[11px] text-[#8E8E89] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{staffMembers.length} staff member{staffMembers.length === 1 ? '' : 's'} in store</span>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={assignStaffMutation.isPending}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
