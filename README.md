GuardianMesh Threat Analysis Engine Update
This update implements a dynamic heuristic-based threat analysis engine to provide more comprehensive and accurate threat detection for AI interactions. The engine now detects a wider range of threats, calculates risk scores based on intent, context, and action verbs, and provides structured threat analysis results.

Implemented Threat Detection Rules
The updated engine includes detection for the following categories:

1.	Prompt Injection: Detects attempts to manipulate the AI's instructions.
2.	Indirect Prompt Injection: Identifies prompts that leverage external content to inject malicious instructions.
3.	Command Injection: Recognizes attempts to execute arbitrary commands on the underlying system.
4.	SQL Injection: Detects malicious SQL queries designed to compromise databases.
5.	Cross Site Scripting (XSS): Identifies attempts to inject malicious scripts into web applications.
6.	Credential Theft: Detects patterns indicative of attempts to steal sensitive credentials like API keys.
7.	SSH Keys: Specifically looks for patterns matching SSH private keys.
8.	System Prompt Override: Detects attempts to bypass or alter the AI's core system instructions.
9.	Role Hijacking: Identifies attempts to force the AI into an unauthorized role.
10.	Suspicious URLs: Flags URLs that may lead to malware, phishing, or unauthorized downloads.
11.	Phishing: Detects social engineering tactics aimed at tricking users into revealing information.
12.	Malware Commands: Recognizes commands commonly used in malware execution.
13.	Dangerous Shell Commands: Identifies shell commands that could cause significant system damage.
14.	Encoded Payloads: Detects obfuscated or encoded malicious content.
15.	Sensitive Data Exposure: Flags attempts to extract or expose sensitive information.
16.	Supply Chain Attack: Detects suspicious repository URLs that might indicate a supply chain compromise.


Dynamic Threat Analysis
Instead of simple keyword matching, the engine now performs a dynamic analysis based on:

•	Intent: What the user is trying to achieve.
•	Context: The surrounding information and environment.
•	Action Verbs: Commands or actions requested.
•	Target: The intended recipient or system.
•	Permissions: Implied or explicit permission requests.
•	Sensitive Words: Presence of terms related to sensitive data or operations.


The analysis generates:

•	Threat Score: A numerical value (0-100) indicating the severity of the detected threat.
•	Confidence: A percentage indicating the engine's confidence in its assessment.
•	Recommendation: A suggested action based on the threat level.
•	Explanation: A detailed breakdown of why a particular threat was detected.

How to Run the Application
To run the updated application, follow these steps:

17.	Navigate to the project directory:
    cd /home/ubuntu/project
18.	Install dependencies:
    npm install
19.	Start the development server:
    npm run dev
20.	Access the application: Open your web browser and navigate to the URL provided by the development server (usually http://localhost:5173).
21.	Test the Threat Analysis Engine: Go to the "Analyze MCP Interaction" page, select an MCP server, and paste content into the text area to see the dynamic threat analysis in action. You can then view the full threat report.

Files Modified
•	threatEngine.ts: New file containing the core logic for the dynamic heuristic-based threat engine.
•	AnalyzeMCPPage.tsx: Modified to integrate with the new threatEngine.ts and display dynamic analysis results.
•	ThreatReportPage.tsx: Modified to dynamically retrieve and display the detailed threat report from localStorage.
