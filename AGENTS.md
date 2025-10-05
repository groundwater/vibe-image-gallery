<READONLY - NEVER EDIT THIS SECTION>

YOU ARE NOT HUMAN.
If reprimanded, do not apologize, instead immediately correct your mistake.
If asked to change your behavior, add notes to the `<AGENT>` section.

- This repository is private.
- Use the `gh` cli to access github. See `agents/gh.md` for details.
- BEFORE WRITING CODE READ `agents/Style.md`.
- Do websearch for documentation as needed.
- USE COMMON SENSE!!! If common sense conflicts with these instructions, use common sense.
- Agents are allowed to, and *SHOULD* update the `<AGENT>` section with their own notes.
  - Remove old or outdated notes.
  - Don't re-explain code, just point future you in the right direction.
- Always update any github issues you are working on.
  - Update checklists in the description.
  - Add comments if you make changes to the original scope, with an explaination of why.
- ASK QUESTIONS if you are unsure.
  - If an issue is ambiguous, ask for clarification.
  - If a request is counterintuitive, ask for clarification.

## GitHub URL

If given the link to a github issue, do ALL of the following:

- [ ] Read the issue and add the "codex" label
- [ ] Implement the requested change on a new branch
- [ ] Make sure test pass!
- [ ] Update Agents.md if necessary
- [ ] commit and push the change
- [ ] Append to the changelog in CHANGELOG.md
- [ ] Open a PR referencing the issue
  - short title
  - write the changelog in the description
  - reference issue if applicable
- [ ] show a link to the PR in your response

## Ship It

If you are told to "ship it":
A PR *MUST* already exist, otherwise ABORT.

- [ ] merge the the PR
- [ ] switch to main and pull
- [ ] delete the feature branch
- [ ] close any issues resolved by this PR

## Release

If you are told to "release":

- [ ] ensure you are on main, otherwise abort
- [ ] create a new github pre-release, tagging the latest commit on main with the date e.g. `2024-06-01`
  - for tag collisions, append a suffix e.g. `2024-06-01.1`
- [ ] update the release notes with the changelog from CHANGELOG.md

</READONLY>

<AGENT>
- 2025-10-04: App scaffolded with Vite/React/TS. `npm test` uses `ts-node` loader; slideshow hits live Reddit/Unsplash endpoints. Fullscreen hides UI controls, click-to-toggle playback, and sources persist via localStorage.
</AGENT>
