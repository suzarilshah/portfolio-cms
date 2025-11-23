import { stackServerApp } from "@/stack";

export default async function DebugAuth() {
  try {
    console.log("Testing Stack Auth initialization...");
    
    // Test basic app initialization
    const appInfo = {
      projectId: stackServerApp.projectId,
      baseUrl: stackServerApp.urls?.baseUrl,
    };
    
    console.log("Stack App initialized:", appInfo);
    
    // Test user retrieval
    const user = await stackServerApp.getUser();
    console.log("User retrieved:", user ? user.primaryEmail : "No user");
    
    return (
      <div className="p-8">
        <h1>Stack Auth Debug</h1>
        <pre>{JSON.stringify(appInfo, null, 2)}</pre>
        <pre>{JSON.stringify({ user: user ? { email: user.primaryEmail, displayName: user.displayName } : null }, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error("Stack Auth error:", error);
    return (
      <div className="p-8">
        <h1>Stack Auth Error</h1>
        <pre className="text-red-600">{String(error)}</pre>
      </div>
    );
  }
}
