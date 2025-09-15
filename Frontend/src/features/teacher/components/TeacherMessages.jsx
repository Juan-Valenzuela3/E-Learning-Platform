import React, { useState } from 'react';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Star, Archive } from 'lucide-react';

const MessageItem = ({ message, isSelected, onClick }) => (
  <div 
    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
      isSelected ? 'bg-indigo-50 border-indigo-200' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-start space-x-3">
      <img 
        src={message.avatar} 
        alt={message.sender}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {message.sender}
          </h3>
          <span className="text-xs text-gray-500">{message.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1">{message.preview}</p>
        {message.unread && (
          <div className="flex items-center mt-2">
            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            <span className="text-xs text-indigo-600 font-medium">Nuevo mensaje</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

const MessageThread = ({ message }) => (
  <div className="flex-1 flex flex-col">
    {/* Header */}
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={message.avatar} 
            alt={message.sender}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{message.sender}</h2>
            <p className="text-sm text-gray-500">{message.course}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Star className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Archive className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {message.messages?.map((msg, index) => (
        <div key={index} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            msg.isOwn 
              ? 'bg-indigo-500 text-white' 
              : 'bg-white text-gray-900 shadow-sm border border-gray-200'
          }`}>
            <p className="text-sm">{msg.content}</p>
            <p className={`text-xs mt-1 ${msg.isOwn ? 'text-indigo-100' : 'text-gray-500'}`}>
              {msg.time}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Message Input */}
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center space-x-3">
        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
          <Paperclip className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
);

const TeacherMessages = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'María González',
      course: 'Desarrollo Web Moderno',
      preview: 'Tengo una duda sobre el módulo de React...',
      time: '10:30 AM',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      messages: [
        {
          content: 'Hola profesor, tengo una duda sobre el módulo de React. ¿Podrías explicarme mejor cómo funcionan los hooks?',
          time: '10:25 AM',
          isOwn: false
        },
        {
          content: 'Hola María, claro que sí. Los hooks son funciones especiales que te permiten usar el estado y otras características de React en componentes funcionales.',
          time: '10:30 AM',
          isOwn: true
        }
      ]
    },
    {
      id: 2,
      sender: 'Carlos Rodríguez',
      course: 'Python para Principiantes',
      preview: 'Gracias por la explicación de las listas...',
      time: '9:15 AM',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      messages: [
        {
          content: 'Gracias por la explicación de las listas en Python. Ahora entiendo mucho mejor.',
          time: '9:15 AM',
          isOwn: false
        }
      ]
    },
    {
      id: 3,
      sender: 'Ana Martínez',
      course: 'Machine Learning Básico',
      preview: '¿Cuándo será la próxima clase en vivo?',
      time: 'Ayer',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&q=80',
      messages: [
        {
          content: '¿Cuándo será la próxima clase en vivo? No quiero perderme la explicación de redes neuronales.',
          time: 'Ayer 4:20 PM',
          isOwn: false
        }
      ]
    }
  ];

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mensajes</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comunícate con tus estudiantes y responde sus dudas
        </p>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
        <div className="flex h-full">
          {/* Messages List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar mensajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    isSelected={selectedMessage?.id === message.id}
                    onClick={() => setSelectedMessage(message)}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron mensajes</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              <MessageThread message={selectedMessage} />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona una conversación
                  </h3>
                  <p className="text-gray-500">
                    Elige un mensaje de la lista para comenzar a chatear
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mensajes Nuevos</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Respondidos Hoy</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tiempo de Respuesta</p>
              <p className="text-2xl font-bold text-gray-900">2.5h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
