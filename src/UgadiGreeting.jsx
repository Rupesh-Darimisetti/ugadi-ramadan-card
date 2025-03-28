import html2canvas from 'html2canvas'
import React, { Component } from 'react'
import './App.css'

class UgadiGreeting extends Component {

    state = {
        // Create state variables for name, festival, customMessage, card, history, step, and showForm
        name: '',
        festival: '',
        customMessage: '',
        card: null,
        history: JSON.parse(localStorage.getItem("greetingHistory")) || [],
        step: 1,
        showForm: true,
    }

    generateGreeting = (name, festival, customMessage) => {
        const greetings = {
            ugadi: 'Enjoy the festival with joy!',
            ramadan: 'May this festival bring happiness!',
        }

        const title =
            festival === 'ugadi'
                ? `Happy Ugadi, ${name}!`
                : `Ramadan Mubarak, ${name}!`
        const message = greetings[festival]
        const theme = festival === 'ugadi' ? 'ugadi-card' : 'ramadan-card'
        const custommsg = customMessage ? ` ${customMessage}` : ''

        return { title, message, theme, custommsg }
    }

    // Function to navigate to the next step in the form
    handleNext = () => {
        const { step, name, festival, customMessage } = this.state
        // Step 1: Validate if the user has entered a name
        // Step 2: Ensure a festival is selected before proceeding
        // Step 3: Move to final submission step
        // If all validations pass, increment the step state to move forward
        if (step == 1 && !name.trim()) {
            alert('Enter your name');
            return
        }
        if (step == 2 && !festival.trim()) {
            alert("Enter the festival")
            return
        }
        if (step === 3 && customMessage.length > 20) {
            alert("Enter a custom message of length 20 character or below")
            return
        }
        this.setState({ step: step + 1 });
    }

    // Function to navigate back to the previous step
    handleBack = () => {
        // Decrease the step value to go back to the previous step
        const { step } = this.state
        this.setState({ step: step - 1 })
    }

    // Function to submit the greeting form
    handleSubmit = () => {
        // Extract required state values
        const { name, festival, customMessage, history } = this.state
        // Step 1: Trim whitespace from the name and use 'Friend' as default if empty
        if (name.trim().length === 0) {
            this.setState({ name: "Friend" })
        }

        // Step 2: Generate a greeting message using the provided details
        const greeting = this.generateGreeting(name, festival, customMessage)
        // Step 3: Update the state with the new greeting

        this.setState({
            card: greeting, // Store the generated greeting card
            history: [`${greeting.title} - ${greeting.message} - ${greeting.custommsg}`, ...history].slice(0, 3), // Keep only the last 3 greeting entries
            showForm: false// Hide the form after submission
        });
        localStorage.setItem("greetingHistory", JSON.stringify(history))
    }

    handleDownload = () => {
        const { card } = this.state

        if (this.cardRef) {
            this.cardRef.scrollIntoView({ behavior: 'smooth', block: 'start' })
            this.cardRef.style.animation = 'none'

            html2canvas(this.cardRef, {
                scale: 3,
                useCORS: true,
                logging: false,
                backgroundColor: null,
                width: this.cardRef.scrollWidth,
                height: this.cardRef.scrollHeight,
            }).then(canvas => {
                const link = document.createElement('a')
                link.download = `${card.title}.png`
                link.href = canvas.toDataURL('image/png', 1.0)
                link.click()
                this.cardRef.style.animation = 'cardAppear 0.5s ease-in'
            })
        }
    }
    // Function to reset form and create a new greeting card
    handleCreateNewCard = () => {
        // Reset state variables to initial values
        this.setState({
            name: '',
            festival: '',
            customMessage: '',
            card: null,
            history: JSON.parse(localStorage.getItem("greetingHistory")) || [],
            step: 1,
            showForm: true,
        })
    }


    // Function to clear greeting history
    handleClearHistory = () => {
        // Step 1: Reset the history state to an empty arrays
        this.history = []
        // Step 2: Remove the stored history from localStorage
        localStorage.removeItem("greetingHistory")
    }

    render() {
        // Destructure state variables for use in the render method
        const { name, festival, customMessage, card, history, step, showForm } = this.state
        return (
            <div className="body">
                <div className="container">
                    <h1>Festival Greeting Generator</h1>

                    {/* Show form only when showForm is true */}
                    {showForm && (
                        <form id="greetingForm">
                            {/* Step 1: Input for user name */}
                            {step === 1 && (
                                <div className="form-group">
                                    <label htmlFor="name">Step 1: Your Name</label>
                                    {/* Input field to enter name */}
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={e => this.setState({ name: e.target.value })}
                                        required
                                    />
                                    {/* Button to go to next step */}
                                    <div className="button-group">
                                        <button type="button" onClick={this.handleNext}>
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Dropdown to select festival */}
                            {step === 2 && (
                                <div className="form-group">
                                    <label htmlFor="festival">Step 2: Choose Festival</label>
                                    {/* Dropdown menu for festival selection */}
                                    <select
                                        id="festival"
                                        value={festival}
                                        onChange={e => this.setState({ festival: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a festival
                                        </option>
                                        <option value="ugadi">Ugadi</option>
                                        <option value="ramadan">Ramadan</option>
                                    </select>
                                    {/* Buttons to navigate steps */}
                                    <div className="button-group">
                                        <button type="button" onClick={this.handleBack}>
                                            Back
                                        </button>
                                        <button type="button" onClick={this.handleNext}>
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Input for custom message */}
                            {step === 3 && (
                                <div className="form-group">
                                    <label htmlFor="customMessage">
                                        Step 3: Custom Message (max 20 characters)
                                    </label>
                                    {/* Input field for custom message */}
                                    <input
                                        type="text"
                                        id="customMessage"
                                        placeholder="E.g., Stay blessed!"
                                        value={customMessage}
                                        onChange={e =>
                                            this.setState({ customMessage: e.target.value })
                                        }
                                        maxLength="20"
                                    />
                                    {/* Buttons to navigate and submit */}
                                    <div className="button-group">
                                        <button type="button" onClick={this.handleBack}>
                                            Back
                                        </button>
                                        <button type="button" onClick={this.handleSubmit}>
                                            Generate Greeting Card
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}

                    {/* Display generated greeting card */}
                    {card && (
                        <>
                            <div
                                id="greeting-card"
                                className={card.theme}
                                ref={ref => (this.cardRef = ref)}
                            >
                                <div className="text-container">
                                    <h2 className="name">{card.title}</h2>
                                    <p>{card.message}</p>
                                    <p>{card.custommsg}</p>
                                </div>
                            </div>
                            {/* Buttons for downloading and creating new card */}
                            <div className="button-group">
                                <button
                                    type="button"
                                    onClick={this.handleDownload}
                                    className="download-btn"
                                >
                                    Download Card
                                </button>
                                <button
                                    type="button"
                                    onClick={this.handleCreateNewCard}
                                    className="new-card-btn"
                                >
                                    Create New Card
                                </button>
                            </div>
                        </>
                    )}

                    {/* Display greeting history */}
                    {history.length > 0 && (
                        <div id="history">
                            <div className="history-header">
                                <h3>Previous Greetings</h3>
                                <button
                                    type="button"
                                    onClick={this.handleClearHistory}
                                    className="clear-btn"
                                >
                                    Clear All
                                </button>
                            </div>
                            <ul>
                                {/* List of past greeting messages */}
                                {history.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default UgadiGreeting
