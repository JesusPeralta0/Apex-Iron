document.addEventListener("DOMContentLoaded", () => {
    // 1. Inyectar automáticamente la hoja de estilos del footer en el <head>
    // if (!document.querySelector('link[href="/css/footer.css"]')) {
    //     const link = document.createElement("link");
    //     link.rel = "stylesheet";
    //     link.href = "/css/footer.css";
    //     document.head.appendChild(link);
    // }

    // 2. Cargar el contenido HTML del footer y colocarlo en el contenedor
    fetch("/componentes/Footer/index.html")
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar el componente del footer");
            return response.text();
        })
        .then(html => {
            const container = document.getElementById("footer-container");
            if (container) {
                container.innerHTML = html;

                const schoolBanner = container.querySelector(".school-banner");
                if (schoolBanner && !schoolBanner.dataset.ironcitoBound) {
                    schoolBanner.dataset.ironcitoBound = "true";
                    schoolBanner.addEventListener("click", (event) => {
                        event.preventDefault();
                        const prompt =
                            schoolBanner.dataset.ironcitoPrompt || "Quiero aprender sobre computadoras";

                        const openEvent = new CustomEvent("ironcito:open", {
                            cancelable: true,
                            detail: { prompt },
                        });
                        document.dispatchEvent(openEvent);

                        // si ironcito aun no se habia montado lo importa y abre con la accion
                        if (!openEvent.defaultPrevented) {
                            import("/agente-ironcito/js/ironcito-agente.js")
                                .then((mod) => mod.initIroncito?.()?.openWithPrompt(prompt))
                                .catch(() => {});
                        }
                    });
                }
            }
        })
        .catch(error => console.error("Hubo un problema al inyectar el footer:", error));
});