# InputBox Component

A reusable chat-like input component with action buttons and menus.

## Features

- **Text Input**: Main input field with placeholder support
- **Action Buttons**: Send, microphone, tools, and upload buttons
- **Dropdown Menus**: Tools and upload menus with toggle functionality
- **Keyboard Support**: Enter key to send messages
- **Customizable**: Configurable props for different use cases
- **TypeScript**: Full TypeScript support with proper type definitions

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `'Ask Anything'` | Placeholder text for the input field |
| `initialValue` | `string` | `''` | Initial value for the input field |
| `onInputChange` | `(value: string) => void` | `undefined` | Callback when input value changes |
| `onSend` | `(value: string) => void` | `undefined` | Callback when send button is clicked or Enter is pressed |
| `onMicClick` | `() => void` | `undefined` | Callback when microphone button is clicked |
| `onToolsClick` | `() => void` | `undefined` | Callback when tools button is clicked |
| `onPlusClick` | `() => void` | `undefined` | Callback when plus button is clicked |
| `disabled` | `boolean` | `false` | Whether the input is disabled |
| `className` | `string` | `''` | Custom CSS classes for the container |
| `showTools` | `boolean` | `true` | Whether to show the tools menu |
| `showUpload` | `boolean` | `true` | Whether to show the upload menu |

## Usage

### Basic Usage

```tsx
import { InputBox } from '@/components/ui';

function ChatComponent() {
  const handleSend = (message: string) => {
    console.info('Sending message:', message);
    // Add your send logic here
  };

  return (
    <InputBox
      placeholder="Type your message..."
      onSend={handleSend}
    />
  );
}
```

### Advanced Usage with All Callbacks

```tsx
import { InputBox } from '@/components/ui';

function AdvancedChatComponent() {
  const handleSend = (message: string) => {
    // Send message to API
    sendMessageToAPI(message);
  };

  const handleMicClick = () => {
    // Start voice recording
    startVoiceRecording();
  };

  const handleToolsClick = () => {
    // Open tools panel
    openToolsPanel();
  };

  const handlePlusClick = () => {
    // Open upload dialog
    openUploadDialog();
  };

  const handleInputChange = (value: string) => {
    // Handle input changes (e.g., for auto-save)
    autoSaveDraft(value);
  };

  return (
    <InputBox
      placeholder="Ask me anything..."
      initialValue=""
      onSend={handleSend}
      onMicClick={handleMicClick}
      onToolsClick={handleToolsClick}
      onPlusClick={handlePlusClick}
      onInputChange={handleInputChange}
      disabled={false}
      className="custom-input-box"
      showTools={true}
      showUpload={true}
    />
  );
}
```

### Conditional Rendering

```tsx
import { InputBox } from '@/components/ui';

function ConditionalInputComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showTools, setShowTools] = useState(true);

  return (
    <InputBox
      disabled={isLoading}
      showTools={showTools}
      showUpload={!isLoading}
      onSend={(message) => {
        setIsLoading(true);
        // Send message and handle response
        sendMessage(message).finally(() => setIsLoading(false));
      }}
    />
  );
}
```

## Styling

The component uses Tailwind CSS classes and follows the design system. The main container has these classes:

```css
flex w-full flex-col shadow border border-divider bg-background h-fit px-2 py-4 rounded-8 gap-2 group
```

### Custom Styling

You can override styles using the `className` prop:

```tsx
<InputBox
  className="custom-input-box bg-blue-50 border-blue-200"
  onSend={handleSend}
/>
```

## Keyboard Shortcuts

- **Enter**: Send message (if input is not empty)
- **Shift + Enter**: New line (if needed in future implementations)

## Accessibility

The component includes proper accessibility features:

- Proper ARIA labels for buttons
- Keyboard navigation support
- Focus management
- Screen reader friendly structure

## Dependencies

- `react`: React library
- `lucide-react`: Icon library for the action buttons
- `ToolsMenu`: Custom tools menu component
- `UploadMenu`: Custom upload menu component

## Notes

- The component automatically clears the input after sending a message
- The upload menu uses a checkbox hack for toggling visibility
- All buttons have hover states and transitions
- The component is fully controlled and manages its own input state 