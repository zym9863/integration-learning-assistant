# Integration Learning Assistant

English | [中文](./README.md)

An interactive integration learning application built with Remix, helping students better understand and master integration concepts through visualization and practice.

## 🌟 Main Features

### 📚 Interactive Integration Practice
- **Multiple Function Types**: Support for power functions, trigonometric functions, exponential functions, logarithmic functions, etc.
- **Smart Answer Verification**: Automatically check answer correctness with support for various expression formats
- **Detailed Solution Steps**: Provide complete solution processes and integration method explanations
- **Adaptive Difficulty**: Three difficulty levels (Easy, Medium, Hard)
- **Real-time Feedback**: Instant display of answer correctness and learning suggestions

### 📊 Definite Integration Visualization
- **Function Graph Plotting**: Dynamically generate function graphs
- **Integration Area Highlighting**: Visually demonstrate the geometric meaning of integration
- **Riemann Sum Demonstration**: Understand integration concepts through rectangle approximation
- **Precise Numerical Calculation**: High-precision integration calculation using trapezoidal rule
- **Interactive Charts**: Support for zooming, panning, and other operations

## 🛠 Tech Stack

- **Frontend Framework**: Remix (React)
- **Styling**: Tailwind CSS + Custom CSS
- **Mathematical Computation**: Math.js
- **Mathematical Formula Rendering**: KaTeX
- **Data Visualization**: Plotly.js
- **Build Tool**: Vite
- **Type Checking**: TypeScript

## 📁 Project Structure

```
app/
├── components/
│   └── ClientOnlyPlot.tsx         # Client-side chart component
├── routes/
│   ├── _index.tsx                 # Homepage - Feature introduction and navigation
│   ├── practice.tsx               # Integration practice page
│   └── visualize.tsx              # Definite integration visualization page
├── entry.client.tsx               # Client entry point
├── entry.server.tsx               # Server entry point
├── root.tsx                       # Root component - HTML structure and styles
└── tailwind.css                   # Custom styles and themes
```

## 🚀 Quick Start

### Requirements
- Node.js >= 20.0.0

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Run Production Version
```bash
npm start
```

## 🎯 Usage Guide

### Beginner Recommendations
1. **Learn Basic Integration Formulas** - Familiarize yourself with common function integrations
2. **Understand Integration Concepts Through Visualization** - Use the definite integration visualization tool to build geometric intuition
3. **Practice Various Problem Types Gradually** - Start with simple problems and progress step by step

### Advanced Learning
1. **Master Substitution Integration** - Handle complex function integrations
2. **Learn Integration by Parts** - Solve product-form integrations
3. **Practice Complex Function Integration** - Challenge high-difficulty problems

## 🎨 Interface Features

- **Modern Design**: Glass morphism effects, gradient colors, and smooth animations
- **Dark Mode Support**: Automatically adapts to system theme
- **Responsive Layout**: Perfect adaptation to various screen sizes
- **Interactive Experience**: Rich hover effects and transition animations

## 📊 Feature Details

### Integration Practice Module
- Randomly generate various types of integration problems
- Support different function types: polynomials, trigonometric functions, exponential functions, logarithmic functions
- Three difficulty levels suitable for different learning stages
- Real-time answer verification and detailed solution steps
- Learning progress tracking and accuracy statistics

### Visualization Calculation Module
- Input arbitrary mathematical function expressions
- Customize integration bounds
- Real-time image rendering and integration area marking
- Riemann sum animation demonstration with adjustable rectangle count
- High-precision numerical integration calculation
- Preset example functions for quick experience

## 🔧 Development

### Code Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

### Main Dependencies
- `@remix-run/react`: Web framework
- `mathjs`: Mathematical expression parsing and calculation
- `plotly.js`: Data visualization
- `katex`: Mathematical formula rendering
- `tailwindcss`: CSS framework

## 🎓 Educational Value

This application aims to enhance the integration learning experience through:

1. **Visual Understanding**: Transform abstract mathematical concepts into intuitive graphics
2. **Immediate Feedback**: Help students discover and correct errors promptly
3. **Self-directed Learning**: Provide rich practice problems and detailed solutions
4. **Progressive Learning**: Complete learning path from basics to advanced

## 📝 License

Private project, for learning and educational use only.

## 🤝 Contributing

Welcome suggestions and improvements to make this integration learning tool even better!
