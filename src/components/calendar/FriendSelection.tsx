import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface Friend {
  id: string;
  name: string;
 email: string;
  avatar?: string;
}

interface FriendSelectionProps {
  friends: Friend[];
  selectedInvitees: string[];
  onSelectionChange: (invitees: string[]) => void;
}

const FriendSelection: React.FC<FriendSelectionProps> = ({
  friends,
  selectedInvitees,
  onSelectionChange,
}) => {
  const [manualEmail, setManualEmail] = useState('');

  const handleFriendToggle = (email: string) => {
    if (selectedInvitees.includes(email)) {
      // Remove friend from selected list
      onSelectionChange(selectedInvitees.filter(invitee => invitee !== email));
    } else {
      // Add friend to selected list
      onSelectionChange([...selectedInvitees, email]);
    }
 };

  const handleManualEmailAdd = () => {
    if (manualEmail && !selectedInvitees.includes(manualEmail)) {
      onSelectionChange([...selectedInvitees, manualEmail]);
      setManualEmail('');
    }
 };

  const handleManualEmailRemove = (email: string) => {
    onSelectionChange(selectedInvitees.filter(invitee => invitee !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualEmailAdd();
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3 text-white">Invite Friends</h3>
      
      {/* Selected Invitees List */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {selectedInvitees.map((invitee) => (
            <div 
              key={invitee} 
              className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center"
            >
              {invitee}
              <button
                type="button"
                className="ml-2 text-white hover:text-gray-20"
                onClick={() => handleManualEmailRemove(invitee)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Manual Email Input */}
      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            value={manualEmail}
            onChange={(e) => setManualEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-[#4a4646] text-white border-[#FFD966]"
          />
          <button
            type="button"
            className="px-4 py-2 bg-[#FFD966] text-[#353131] rounded-md hover:bg-[#ffc827]"
            onClick={handleManualEmailAdd}
          >
            Add
          </button>
        </div>
      </div>
      
      {/* Friends List */}
      <div className="max-h-60 overflow-y-auto border-[#FFD966] rounded-md p-2 bg-[#4a4646]">
        {friends.map((friend) => (
          <div 
            key={friend.id}
            className={`flex items-center p-2 rounded-md cursor-pointer ${
              selectedInvitees.includes(friend.email) 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-[#5a5656] text-white'
            }`}
            onClick={() => handleFriendToggle(friend.email)}
          >
            {friend.avatar ? (
              <img 
                src={friend.avatar} 
                alt={friend.name} 
                className="w-8 h-8 rounded-full mr-3"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-black">
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-white">
              <div className="font-medium">{friend.name}</div>
              <div className="text-sm text-gray-300">{friend.email}</div>
            </div>
            <input
              type="checkbox"
              checked={selectedInvitees.includes(friend.email)}
              onChange={() => {}}
              className="ml-auto form-checkbox h-4 w-4 text-blue-600 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSelection;