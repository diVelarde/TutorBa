import React from "react";
import { createRoot } from "react-dom/client";
import * as AppModule from "./App";
import ErrorBoundary from "./components/ErrorBoundary";

// CSS libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Render
const container = document.getElementById("root");
if (!container) {
	// If the root div is missing, show a helpful message in document body
	document.body.innerHTML =
		"<div style='padding:24px'><h2>Missing #root element</h2><p>Check that index.html contains &lt;div id=\"root\"&gt;&lt;/div&gt; and that this script is loaded after it.</p></div>";
} else {
		const root = createRoot(container);
		// defensive: AppModule may export a default or named export depending on tooling.
		// Try to pick the default, then a named App export, then the module itself.
		// This avoids build-time failures if Rollup can't statically find a default export.
		// Also helpful for debugging — we log available exports to the console.
		// eslint-disable-next-line no-console
		console.log("App module exports:", AppModule);
		const AppComp = AppModule.default || AppModule.App || AppModule;
		root.render(
			<ErrorBoundary>
				<AppComp />
			</ErrorBoundary>
		);
}