export type ChatConfig = {
  endpoint: string;
  parseBotText: (res: ChatResponse) => string;
};

export type ChatRequest = {
  session_id: string;
  timestamp: string;
  query: string;
};

export type RoomOption = {
  RoomID: string;
  RoomName: string;
  Building: string;
  Floor: number;
  Capacity: number;
  HasConferenceCall: boolean;
  HasVideo: boolean;
  HasAudio: boolean;
  HasDisplay: boolean;
  HasWhiteboard: boolean;
  IsAccessible: boolean;
};

export type RoomBooking = {
  BookingID: string;
  Date: string;      // YYYY-MM-DD
  StartTime: string; // HH:mm
  EndTime: string;   // HH:mm
};

export type ChatResponse = {
  message?: string;
  booking_id?: string | null;
  room_options?: RoomOption[];
  room_bookings?: RoomBooking[];
  [k: string]: any;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  ts: number;

  payload?: {
    bookingId?: string | null;
    roomOptions?: RoomOption[];
    roomBookings?: RoomBooking[];
  };
};