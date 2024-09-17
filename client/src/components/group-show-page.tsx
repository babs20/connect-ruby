'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, UserPlus } from 'lucide-react';

// This would typically come from your API or props
const groupData = {
  id: '1',
  title: 'React Developers Group',
  description: 'A group for React developers to share knowledge and collaborate on projects.',
  privacySetting: 'Public',
  createdAt: '2023-06-15T10:30:00Z',
  members: [
    { id: '1', name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40' },
    { id: '2', name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40' },
    { id: '3', name: 'Bob Johnson', avatar: '/placeholder.svg?height=40&width=40' },
  ],
};

export function GroupShowPageComponent() {
  const [group, setGroup] = useState(groupData);

  const handleEdit = () => {
    console.log('Edit group');
    // Implement edit functionality
  };

  const handleDelete = () => {
    console.log('Delete group');
    // Implement delete functionality
  };

  const handleAddMember = () => {
    console.log('Add member');
    // Implement add member functionality
  };

  return (
    <div className='container p-4 mx-auto'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
          <CardTitle className='text-2xl font-bold'>{group.title}</CardTitle>
          <div className='space-x-2'>
            <Button variant='outline' size='icon' onClick={handleEdit}>
              <Edit className='w-4 h-4' />
            </Button>
            <Button variant='outline' size='icon' onClick={handleDelete}>
              <Trash2 className='w-4 h-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {group.description && <p className='text-muted-foreground'>{group.description}</p>}
            <div className='flex items-center space-x-2'>
              <Badge variant='secondary'>{group.privacySetting}</Badge>
              <span className='text-sm text-muted-foreground'>
                Created on {new Date(group.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <h3 className='mb-2 text-lg font-semibold'>Members</h3>
              <div className='flex flex-wrap gap-2'>
                {group.members.map((member) => (
                  <Avatar key={member.id}>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                <Button variant='outline' size='icon' onClick={handleAddMember}>
                  <UserPlus className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
