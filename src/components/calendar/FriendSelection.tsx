import React from 'react';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  type: 'internal';
}

interface SelectedInvitee {
  email: string;
  type: 'internal';
}

interface FriendSelectionProps {
  friends: Friend[];
  selectedInvitees: SelectedInvitee[];
  onSelectionChange: (invitees: SelectedInvitee[]) => void;
}

const FriendSelection: React.FC<FriendSelectionProps> = ({
  friends,
 selectedInvitees,
  onSelectionChange,
}) => {
  
  // Helper function to check if an email is already selected
  const isEmailSelected = (email: string): boolean => {
    return selectedInvitees.some(invitee => invitee.email === email);
  };

  const handleFriendToggle = (friend: Friend) => {
      if (isEmailSelected(friend.email)) {
        // Remove friend from selected list
        onSelectionChange(selectedInvitees.filter(invitee => invitee.email !== friend.email));
      } else {
        // Add friend to selected list
        onSelectionChange([...selectedInvitees, { email: friend.email, type: 'internal' as const }]);
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
              key={invitee.email}
              className={`bg-[#FFD966] text-[#353131] px-3 py-1 rounded-full flex items-center`}
            >
              {invitee.email}
              <button
                type="button"
                className="ml-2 text-white hover:text-gray-200"
                onClick={() => {
                  onSelectionChange(selectedInvitees.filter(i => i.email !== invitee.email));
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Friends List */}
      <div className="max-h-60 overflow-y-auto border-[#FFD966] rounded-md p-2 bg-[#4a4646]">
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`flex items-center p-2 rounded-md cursor-pointer ${
              isEmailSelected(friend.email)
                ? 'bg-[#FFD966] text-[#353131]'
                : 'hover:bg-[#5a5656] text-white'
            }`}
            onClick={() => handleFriendToggle(friend)}
          >
            {friend.avatar ? (
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-8 h-8 rounded-full mr-3"
              />
            ) : (
              <div className={`w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3 text-black`}>
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-white">
              <div className="font-medium">{friend.name}</div>
              <div className="text-sm text-gray-30">{friend.email}</div>
            </div>
            <input
              type="checkbox"
              checked={isEmailSelected(friend.email)}
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