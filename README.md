# Dookie Clicker

Dookie Clicker is an incremental clicking game combined with a platformer mini-game. The primary goal is to collect "Dookies" and increase your Dookie generation rate.

## How to Play

The game revolves around several core mechanics:

1.  **Collect Dookies:**
    *   **Manual Clicking:** Click the large "Dookie" button on the right panel to earn a small number of Dookies.
    *   **Platformer Mini-Game:** Control a character in the left panel (the "sketch holder") using the **W** (jump), **A** (move left), and **D** (move right) keys. Collect "turds" that appear on screen by touching them with your character.
        *   Turds provide a set amount of Dookies.
        *   Golden turds (rarer) provide a higher Dookie bonus.
        *   Turds have a timeout period (displayed on them). If not collected before the timeout, they will disappear and a new one will spawn.

2.  **Increase Dookies Per Second (DPS):**
    *   **Buy Items:** Purchase items like "Bartle", "Blicker", and "Smork" from the list on the right. Each item you own contributes to your passive Dookie generation (DPS). The cost of each subsequent item of the same type increases.

3.  **Purchase Upgrades:**
    *   Buy upgrades from the "Upgrades" section. These provide various enhancements, such as:
        *   Increasing the DPS of your buyable items.
        *   Boosting your character's movement speed in the platformer.
        *   Increasing the value of turds collected in the platformer.
    *   Upgrades are typically one-time purchases.

## Features

*   **Incremental Progression:** Start by clicking, then automate Dookie generation by purchasing items and upgrades.
*   **Hybrid Gameplay:** Combines classic idle/clicker mechanics with an active platformer mini-game for resource collection.
*   **Item System:** Multiple types of items to purchase that contribute to your DPS.
*   **Upgrade System:** Various upgrades to enhance different aspects of the game.
*   **Dynamic UI:** Costs and item counts update in real-time. Unaffordable items are visually indicated.
*   **Tooltips:** Upgrades feature descriptive tooltips to explain their effects.

## Running the Game Locally

This game is built with HTML, CSS, and JavaScript. No special build steps or server configurations are required to play the basic game.

1.  Clone or download the repository.
2.  Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Safari, Edge).

## Libraries Used

The game utilizes the following external libraries:

*   **jQuery:** v1.12.4
*   **Bootstrap:** v3.3.7
*   **p5.js:** (version not specified in filename, linked via `js/p5.min.js`)
*   **Tooltipster:** (version not specified in filename, linked via `js/tooltipster.bundle.min.js`)

## Future Enhancements

This game is a project with potential for future improvements and feature additions, such as:
*   More diverse items and upgrades.
*   More complex platformer levels and mechanics.
*   Prestige or reset systems for extended gameplay.
*   Sound effects and enhanced visual feedback.
*   Saving and loading game progress.
*   Refined game balance and difficulty scaling.
