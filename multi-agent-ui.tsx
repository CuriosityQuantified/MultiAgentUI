"use client"

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mic, Paperclip, ChevronLeft, ChevronRight, Wrench, X, ChevronUp, ChevronDown, FileText, Image as ImageIcon, File, FolderOpen, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const initialAgents = [
  { id: "1", name: "Data Scientist", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Data%20Scientist%20Avatar-YWV0r3z4g3daClGj42qAOUYlstYOED.webp", model: "GPT-4", tools: [], capabilities: ["Data Analysis", "Machine Learning", "Statistical Modeling"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "2", name: "Business Strategist", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Business%20Strategist%20Avatar-NXv6Keosg0u57NuwINftYaYvyE9ieT.webp", model: "GPT-4", tools: [], capabilities: ["Market Analysis", "Strategic Planning", "Competitive Analysis"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "3", name: "Software Developer", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Software%20Developer%20Avatar-EckVlQo1zQNFkTvS2GBjpL9Mrz5adm.webp", model: "GPT-4", tools: [], capabilities: ["Full-stack Development", "Code Review", "System Architecture"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "4", name: "QA Tester", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Q&A%20Tester%20Avatar-5tUhMr4QcciMzJv6QWMQUs6OzkeQTa.webp", model: "GPT-3.5", tools: [], capabilities: ["Test Planning", "Automated Testing", "Bug Reporting"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "5", name: "Project Manager", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Project%20Manager%20Avatar-k4KpSe32Mb1AnL4lrd1NPzSlQBh1W5.webp", model: "GPT-4", tools: [], capabilities: ["Project Planning", "Resource Allocation", "Risk Management"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "6", name: "AI Engineer", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI%20Engineer%20Avatar-rHIa2W95TV5vqmNPl5DZz9rg4UtHDE.webp", model: "GPT-4", tools: [], capabilities: ["Neural Network Design", "Model Training", "AI Optimization"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "7", name: "Data Engineer", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Data%20Engineer%20Avatar-yCnVOnlLYAucxOXhhXy2uQyRs8dJRa.webp", model: "GPT-3.5", tools: [], capabilities: ["Data Pipeline Design", "ETL Processes", "Database Management"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "8", name: "Prompt Engineer", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Prompt%20Engineer%20Avatar-KsVOH4mYzIdD4jfkPRkbgRKDgfW8yF.webp", model: "GPT-4", tools: [], capabilities: ["Prompt Optimization", "AI Output Refinement", "Creative Prompt Design"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "9", name: "Researcher", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Researcher%20Avatar-ESYUHireQTssQ9VjhFqzvHDjdVpvou.webp", model: "GPT-3.5", tools: [], capabilities: ["Literature Review", "Data Collection", "Research Methodology"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
  { id: "10", name: "AI Futurist", avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI%20Futurist%20Avatar-Cvtm7MsnZY96CKMrssGLqZd44IGvXB.webp", model: "GPT-4", tools: [], capabilities: ["Technology Forecasting", "Future Scenario Development", "Innovation Strategy"], status: { progress: 0, state: "Idle" }, taskHistory: [], canCommunicateWith: [] },
]

const customTools = [
  { id: "1", name: "Data Visualizer", description: "Create interactive charts and graphs" },
  { id: "2", name: "Code Formatter", description: "Automatically format and style code" },
  { id: "3", name: "Language Translator", description: "Translate text between multiple languages" },
]

const availableModels = ["GPT-3.5", "GPT-4", "DALL-E", "Stable Diffusion"]
const availableTools = ["Code Interpreter", "Web Browsing", "Data Analysis", "Image Generation", "Text-to-Speech", "Speech-to-Text"]

const sharedResources = [
  { id: "1", name: "Project Brief.pdf", type: "pdf" },
  { id: "2", name: "Data Analysis Results.xlsx", type: "excel" },
  { id: "3", name: "Team Photo.jpg", type: "image" },
  { id: "4", name: "Meeting Notes.txt", type: "text" },
]

const agentColors = [
  "bg-blue-600",
  "bg-green-600",
  "bg-yellow-600",
  "bg-red-600",
  "bg-purple-600",
  "bg-pink-600",
  "bg-indigo-600",
  "bg-teal-600",
  "bg-orange-600",
  "bg-cyan-600",
]

export default function MultiAgentUI() {
  const [activeAgents, setActiveAgents] = useState<string[]>([])
  const [inactiveAgents, setInactiveAgents] = useState<string[]>(initialAgents.map(agent => agent.id))
  const [userInput, setUserInput] = useState('')
  const [conversation, setConversation] = useState<{ sender: string; recipient: string; message: string; timestamp: string }[]>([])
  const [code, setCode] = useState('')
  const [isCodeExecuted, setIsCodeExecuted] = useState(false)
  const [expandedAgents, setExpandedAgents] = useState<string[]>([])
  const [agents, setAgents] = useState(initialAgents)
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)
  const [showInactiveAgents, setShowInactiveAgents] = useState(true)
  const [pendingQuestions, setPendingQuestions] = useState<{ id: string; agentName: string; question: string }[]>([])
  const [showSharedResources, setShowSharedResources] = useState(false)
  const [expandedResource, setExpandedResource] = useState<string | null>(null)
  const [showPendingQuestions, setShowPendingQuestions] = useState(false)

  const conversationEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code.trim()) {
        setIsCodeExecuted(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [code])

  useEffect(() => {
    // Update canCommunicateWith for all agents based on active agents
    setAgents(prevAgents => prevAgents.map(agent => ({
      ...agent,
      canCommunicateWith: activeAgents.filter(id => id !== agent.id)
    })))
  }, [activeAgents])

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  const handleUserInput = () => {
    if (userInput.trim()) {
      const newMessage = {
        sender: 'User',
        recipient: 'All',
        message: userInput,
        timestamp: new Date().toLocaleTimeString()
      }
      setConversation(prev => [...prev, newMessage])
      setUserInput('')
      simulateAgentResponses()
    }
  }

  const simulateAgentResponses = () => {
    activeAgents.forEach(agentId => {
      const agent = agents.find(a => a.id === agentId)
      if (agent) {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          if (progress <= 100) {
            updateAgentStatus(agentId, progress, progress === 100 ? "Complete" : "In Progress")
          } else {
            clearInterval(interval)
            addTaskToHistory(agentId, "Simulated task", "Completed successfully")
            
            // Simulate agent response
            const newMessage = {
              sender: agent.name,
              recipient: 'All',
              message: `This is a simulated response from ${agent.name}.`,
              timestamp: new Date().toLocaleTimeString()
            }
            setConversation(prev => [...prev, newMessage])

            // Simulate agent question (50% chance)
            if (Math.random() > 0.5) {
              const newQuestion = {
                id: `q-${Date.now()}`,
                agentName: agent.name,
                question: `This is a simulated question from ${agent.name}?`
              }
              setPendingQuestions(prev => [...prev, newQuestion])
            }
          }
        }, 1000)
      }
    })
  }

  const updateAgentStatus = (agentId: string, progress: number, state: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status: { progress, state } } : agent
    ))
  }

  const addTaskToHistory = (agentId: string, task: string, outcome: string) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, taskHistory: [...agent.taskHistory, { task, outcome, timestamp: new Date().toISOString() }] } : agent
    ))
  }

  const deployAgent = (agentId: string) => {
    setActiveAgents(prev => [...prev, agentId])
    setInactiveAgents(prev => prev.filter(id => id !== agentId))
  }

  const deployAllAgents = () => {
    setActiveAgents(prev => [...prev, ...inactiveAgents])
    setInactiveAgents([])
  }

  const removeAgent = (agentId: string) => {
    setActiveAgents(prev => prev.filter(id => id !== agentId))
    setInactiveAgents(prev => [...prev, agentId])
  }

  const toggleAgentExpansion = (agentId: string) => {
    setExpandedAgents(prev =>
      prev.includes(agentId)
        ? prev.filter(id => id !== agentId)
        : [...prev, agentId]
    )
  }

  const updateAgentCharacteristics = (agentId: string, field: 'model' | 'tools' | 'capabilities' | 'canCommunicateWith', value: string | string[]) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, [field]: value }
          : agent
      )
    )
  }

  const toggleCommunication = (agentId: string, targetId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? {
              ...agent,
              canCommunicateWith: agent.canCommunicateWith.includes(targetId)
                ? agent.canCommunicateWith.filter(id => id !== targetId)
                : [...agent.canCommunicateWith, targetId]
            }
          : agent
      )
    )
  }

  const toggleAllCommunication = (agentId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? {
              ...agent,
              canCommunicateWith: agent.canCommunicateWith.length === activeAgents.length - 1
                ? []
                : activeAgents.filter(id => id !== agentId)
            }
          : agent
      )
    )
  }

  const handleQuestionSubmit = (questionId: string, answer: string) => {
    const question = pendingQuestions.find(q => q.id === questionId)
    if (question) {
      const newMessage = {
        sender: 'User',
        recipient: question.agentName,
        message: `Answer to "${question.question}": ${answer}`,
        timestamp: new Date().toLocaleTimeString()
      }
      setConversation(prev => [...prev, newMessage])
      setPendingQuestions(prev => prev.filter(q => q.id !== questionId))
    }
  }

  const renderAgentList = (isActive: boolean, items: string[]) => (
    <div className={`${isActive ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' : 'space-y-4'}`}>
      {items.map((id) => {
        const agent = agents.find(a => a.id === id)
        if (!agent) return null
        return (
          <motion.div
            key={agent.id}
            className="relative bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -5, scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
            onMouseEnter={() => setHoveredAgent(agent.id)}
            onMouseLeave={() => setHoveredAgent(null)}
          >
            <Popover>
              <PopoverTrigger asChild>
                <div className={`p-3 cursor-pointer ${isActive ? 'text-center' : 'flex items-center'}`}>
                  <div className={`relative ${isActive ? 'mb-2' : 'mr-4'}`}>
                    <Avatar className={`${isActive ? 'h-12 w-12 mx-auto' : 'h-16 w-16'} rounded-full shadow-lg bg-gradient-to-br from-blue-400 to-purple-500`}>
                      <AvatarImage src={agent.avatar} alt={agent.name} className="rounded-full" />
                      <AvatarFallback>{agent.name[0]}</AvatarFallback>
                    </Avatar>
                    {agent.status.state === "In Progress" && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-blue-500"
                        animate={{
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </div>
                  <h3 className={`${isActive ? 'text-sm' : 'text-lg'} font-semibold ${isActive ? 'text-center' : 'text-left'} text-white ${isActive ? 'mb-1' : ''}`}>{agent.name}</h3>
                  {isActive && (
                    <div className="w-full mt-1">
                      <Progress value={agent.status.progress} className="w-full h-1 bg-gray-700" indicatorClassName="bg-gradient-to-r from-teal-400 to-blue-500" />
                      <span className="text-xs text-gray-400 block text-center mt-1">{agent.status.state}</span>
                    </div>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 text-white p-4 rounded-lg shadow-xl backdrop-blur-lg bg-opacity-80">
                <h3 className="font-bold text-lg mb-2">{agent.name}</h3>
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Model:</h4>
                  <Select
                    value={agent.model}
                    onValueChange={(value) => updateAgentCharacteristics(agent.id, 'model', value)}
                  >
                    <SelectTrigger className="w-full bg-gray-600 text-white border-gray-500">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model} className="hover:bg-gray-600 transition-colors duration-200">
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Tools:</h4>
                  <div className="space-y-2">
                    {availableTools.map((tool) => (
                      <div key={tool} className="flex items-center">
                        <Checkbox
                          id={`${agent.id}-${tool}`}
                          checked={agent.tools.includes(tool)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateAgentCharacteristics(agent.id, 'tools', [...agent.tools, tool])
                            } else {
                              updateAgentCharacteristics(agent.id, 'tools', agent.tools.filter(t => t !== tool))
                            }
                          }}
                        />
                        <label htmlFor={`${agent.id}-${tool}`} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {tool}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {isActive && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-1">Can communicate with:</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id={`all-${agent.id}`}
                          checked={agent.canCommunicateWith.length === activeAgents.length - 1}
                          onCheckedChange={() => toggleAllCommunication(agent.id)}
                        />
                        <label htmlFor={`all-${agent.id}`} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          All
                        </label>
                      </div>
                      {activeAgents.filter(id => id !== agent.id).map((id) => {
                        const targetAgent = agents.find(a => a.id === id)
                        if (!targetAgent) return null
                        return (
                          <div key={id} className="flex items-center">
                            <Checkbox
                              id={`${agent.id}-${id}`}
                              checked={agent.canCommunicateWith.includes(id)}
                              onCheckedChange={() => toggleCommunication(agent.id, id)}
                            />
                            <label htmlFor={`${agent.id}-${id}`} className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              {targetAgent.name}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-1">Task History:</h4>
                  <ul className="text-sm">
                    {agent.taskHistory.slice(-3).map((task, index) => (
                      <li key={index} className="mb-1">
                        <strong>{task.task}</strong>: {task.outcome}
                      </li>
                    ))}
                  </ul>
                </div>
                {!isActive && (
                  <Button
                    className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => deployAgent(agent.id)}
                  >
                    Deploy Agent
                  </Button>
                )}
              </PopoverContent>
            </Popover>
            {isActive && (
              <motion.button
                className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 transition-opacity duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeAgent(agent.id);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredAgent === agent.id ? 1 : 0 }}
              >
                <X size={12} />
              </motion.button>
            )}
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans">
      <motion.div
        className={`transition-all duration-300 ease-in-out ${showInactiveAgents ? 'w-1/4' : 'w-12'} bg-gradient-to-br from-gray-800 to-gray-700 p-4 flex flex-col overflow-y-auto`}
        initial={false}
        animate={{ width: showInactiveAgents ? '25%' : 48 }}
        style={{
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInactiveAgents(!showInactiveAgents)}
          className="self-end mb-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          {showInactiveAgents ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
        </Button>
        <AnimatePresence>
          {showInactiveAgents && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-300">Inactive Agents</h2>
                <Button
                  onClick={deployAllAgents}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2"
                >
                  Deploy All
                </Button>
              </div>
              {renderAgentList(false, inactiveAgents)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Active Agents</h2>
          {renderAgentList(true, activeAgents)}
        </div>
        <div className="flex-1 flex overflow-hidden p-4">
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg mr-4 shadow-lg">
            {conversation.map((entry, index) => {
              const agentIndex = initialAgents.findIndex(agent => agent.name === entry.sender)
              const bgColor = agentColors[agentIndex] || 'bg-gray-700'
              const textColor = entry.sender === 'User' ? 'text-white' : 'text-gray-200'
              return (
                <motion.div
                  key={index}
                  className="mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`${bgColor} bg-opacity-80 backdrop-blur-lg p-2`}>
                    <CardHeader className="p-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className={`text-xs font-medium ${textColor}`}>{entry.sender}</CardTitle>
                        <CardDescription className="text-xs text-gray-300">{entry.recipient}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <p className={`text-sm ${textColor}`}>{entry.message}</p>
                    </CardContent>
                    <CardFooter className="p-2 flex justify-between items-center">
                      <span className="text-xs text-gray-400">{entry.timestamp}</span>
                      <Button variant="ghost" size="sm" className="text-xs text-gray-300 hover:text-white">Reply</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
            <div ref={conversationEndRef} />
          </div>
          <div className="w-1/3 p-4 bg-gradient-to-br from-gray-800 to-gray-700 flex flex-col rounded-lg shadow-lg">
            {isCodeExecuted ? (
              <motion.pre
                className="flex-1 p-2 bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 rounded-lg overflow-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Executed code:
                {code}
              </motion.pre>
            ) : (
              <textarea
                className="flex-1 p-2 bg-gradient-to-br from-gray-700 to-gray-600 text-white border-gray-600 rounded-lg"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code here..."
              />
            )}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg m-4 shadow-lg">
          <div className="flex items-center mb-4">
            <Button
              onClick={() => setShowPendingQuestions(!showPendingQuestions)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white mr-2"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Pending Questions ({pendingQuestions.length})
            </Button>
          </div>
          <AnimatePresence>
            {showPendingQuestions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 mb-4"
              >
                {pendingQuestions.map((question) => (
                  <Card key={question.id} className="bg-opacity-80 backdrop-blur-lg bg-yellow-900 p-2">
                    <CardHeader className="p-2">
                      <CardTitle className="text-xs font-medium">Question from {question.agentName}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      <p className="text-sm">{question.question}</p>
                      <Input
                        className="mt-2 bg-gray-700 text-white border-gray-600 text-sm"
                        placeholder="Your answer..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleQuestionSubmit(question.id, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                      />
                    </CardContent>
                    <CardFooter className="p-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Your answer..."]`) as HTMLInputElement
                          if (input) {
                            handleQuestionSubmit(question.id, input.value)
                            input.value = ''
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Input
              className="flex-1 mr-2 bg-gradient-to-br from-gray-700 to-gray-600 text-white border-gray-600"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleUserInput()}
            />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Mic className="h-6 w-6" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Paperclip className="h-6 w-6" />
              </Button>
            </motion.div>
            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-colors duration-200">
                    <Wrench className="h-6 w-6" />
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 backdrop-blur-lg bg-opacity-80">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none text-gray-300">Custom Tools</h4>
                  {customTools.map((tool) => (
                    <motion.div key={tool.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" className="justify-start bg-gradient-to-br from-gray-700 to-gray-600 text-gray-300 hover:bg-gray-600 transition-colors duration-200">
                        <span>{tool.name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white transition-colors duration-200">
                    <FolderOpen className="h-6 w-6" />
                    <span className="sr-only">Shared Resources</span>
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600 backdrop-blur-lg bg-opacity-80">
                <div className="grid gap-4">
                  <h4 className="font-medium leading-none text-gray-300">Shared Resources</h4>
                  {sharedResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center cursor-pointer hover:bg-gray-700 p-1 rounded"
                      onClick={() => setExpandedResource(expandedResource === resource.id ? null : resource.id)}
                    >
                      {resource.type === 'pdf' && <FileText className="h-4 w-4 mr-2" />}
                      {resource.type === 'excel' && <FileText className="h-4 w-4 mr-2" />}
                      {resource.type === 'image' && <ImageIcon className="h-4 w-4 mr-2" />}
                      {resource.type === 'text' && <File className="h-4 w-4 mr-2" />}
                      <span>{resource.name}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleUserInput}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Send
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}