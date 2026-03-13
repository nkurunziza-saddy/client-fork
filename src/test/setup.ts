import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Mock fetch globally
const fetchMock = vi.fn();
(globalThis as any).fetch = fetchMock;

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});
