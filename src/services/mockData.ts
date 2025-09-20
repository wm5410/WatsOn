// src/services/mockData.ts

export interface Event {
    id: string;
    title: string;
    host: string;
    location: { lat: number; lng: number };
  }
  
  export interface Message {
    id: string;
    sender: string;
    text: string;
    createdAt: Date;
  }
  
  export const SAMPLE_EVENTS: Event[] = [
    {
      id: 'e1',
      title: 'Neighborhood Block Party',
      host: 'Alice',
      location: { lat: 37.7749, lng: -122.4194 },
    },
    {
      id: 'e2',
      title: 'Pop Up Gig Downtown',
      host: 'Bob',
      location: { lat: 37.776, lng: -122.417 },
    },
  ];
  
  export const SAMPLE_MESSAGES: Record<string, Message[]> = {
    e1: [{ id: 'm1', sender: 'Alice', text: 'Hey everyone!', createdAt: new Date() }],
    e2: [{ id: 'm2', sender: 'Bob', text: 'Can’t wait!', createdAt: new Date() }],
  };
  