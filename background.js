'use strict';

const MAX_TABS = 10;
const LIMIT_WARNING = 7;
const LIMIT_RED = 9;

/**
 * Actualiza el texto y color del icono en la barra de tareas.
 *
 * El texto del icono es el número de pestañas abiertas actualmente.
 *
 * El color del icono y su texto se ajusta en función del número de pestañas:
 *
 * - Si hay 0-6 pestañas abiertas, el color es verde y el texto es negro.
 * - Si hay 7-8 pestañas abiertas, el color es naranja y el texto es negro.
 * - Si hay 9 o más pestañas abiertas, el color es rojo y el texto es blanco.
 *
 * @since 1.0
 */
async function updateBadge() {
    try {
        const tabs = await chrome.tabs.query({});
        chrome.action.setBadgeText({ text: tabs.length.toString() });
        let badgeColor = '#00ff00'; // Verde por defecto
        let textColor = '#000000'; // Negro por defecto

        if (tabs.length >= LIMIT_RED) {
            badgeColor = '#ff0000'; // Rojo
            textColor = '#ffffff'; // Blanco
        } else if (tabs.length >= LIMIT_WARNING) {
            badgeColor = '#ffa500'; // Naranja
        }

        chrome.action.setBadgeBackgroundColor({ color: badgeColor });
        chrome.action.setBadgeTextColor({ color: textColor });
    } catch (error) {
        console.error("Error al actualizar el ícono:", error);
    }
}

chrome.tabs.onCreated.addListener(async () => {
    try {
        const tabs = await chrome.tabs.query({});

        if (tabs.length > MAX_TABS) {
            tabs.sort((a, b) => b.id - a.id); // Más nuevo primero
            await chrome.tabs.remove(tabs[0].id);
        }

        await updateBadge();
    } catch (error) {
        console.error("Error al gestionar pestañas:", error);
    }
});

chrome.tabs.onRemoved.addListener(async () => {
    await updateBadge();
});

