// Shared test runner for Papan Gerak scoring tests
// Import this in individual test files

export function setupTest() {
    // Mock environment setup for PineTS
    console.log('Papan Gerak Test Runner');
}

export function report(results) {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${results.length} total`);
    return failed === 0;
}
