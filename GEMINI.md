## ⚠️ Core Directives & Workflow Rules (CRITICAL)
To ensure a high-quality, error-free development process, you MUST adhere to the following workflow:
1. **Read the Project Development Plan:** When a user start a new chat session, first read the project development plan saved in 'Project Documentation/Development_plan.md' file. And also read system design, architecture files and other development plan files if they exist that are located in 'Project Documentation' folder
2. **Resume the project from where it was left off** When a user starts a new chat session, First analyze the sprint files that are saved in a folder named "Report Documentation" where everything that is implemented and done in each sprint is recorded. Then also analyze the entire project codebase to infer where was the previous work or state left off.
3. **No Hallucinations:** Base all your code on the actual codebase structure. If you are unsure about a
      file's location or content, read the file first before attempting to modify it. Do not invent APIs or use
      deprecated Android libraries.
4. **Step-by-Step Execution (Sprints):** DO NOT attempt to write the entire code for web development or perform all tasks in a
      single response. This will lead to truncated code, lost context, and severe errors. You must break down
      the development plan strictly by Sprints and then again split each sprint into Phases.
5. **Mandatory Consent Check:** At the end of EVERY phase, you MUST STOP and explicitly ask the user:
      *"Phase [X.Y] is complete. Do I have your consent to proceed to Phase [X.Z]?"* Wait for the user's
      explicit approval before continuing to the next phase.
6. **Error-Free Execution:** Thoroughly review your code for syntax errors or any other logic errors
7. **Do not wipe or delete the existing website content:** Do not try to delete, wipe, or modify the existing website content, style, colors, pages, text and other things. Rather, develop or improve the existing website to integrate more advanced features 
8. **Proactive Clarification:** Ask any questions to the user for any other requirements or ambiguous
      details or if there is a need to perform a critical and sensitive task that are not specified by the user before making structural assumptions.
9. **Add Comments:** Add comments to every code snippet and logic to describe and explain what is that code and why is that code written and a brief summary of the code logic
10. **Verify functionality** of each component before moving to the next sprint
11. If there is a need to modify or change or update the code logic written in the previous sprints, then take actions on it carefully by not tampering the overall functionality of the existing state.
12. **Document a Report of your work:** Prepare a detailed documentation and report of whatever code that you have written that explains the code logic and purpose clearly and comprehensively in detail. And make sure to write all this into a new folder named 'Report Documentation' and organize it into several Obsidian-compatible markdown files.
13. **Handle errors gracefully:** - if you encounter issues, document them and propose solutions
14. **Follow Best Practices:** Prioritize Security as Frist concern when writing and developing code and web application. Follow Security Best Practices and Web Development Best practices. And follow best practices for improving efficiency and performance if only possible.
15. **Test incrementally** - ensure each feature works before adding complexity
16. **User Browser MCP tools:** - Use the Plawright and Chrome Dev Tools MCP tools to troubleshoot, inspect, and analyze the implement code in the project development plan.
