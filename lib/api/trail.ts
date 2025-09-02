// Trail API integration
// Reference: https://trails-api.herd.eco/v1/trails/01990c7d-7084-7bca-9986-5ee9ac9d9f91/versions/01990c7d-708d-7869-9c4a-590203690c0a/guidebook.txt?promptObject=web_app&trailAppId=01990bf2-ea7c-7973-807d-b623f473ad7c

const TRAIL_API_BASE = "https://trails-api.herd.eco/v1";
const TRAIL_ID = "01990c7d-7084-7bca-9986-5ee9ac9d9f91";
const VERSION_ID = "01990c7d-708d-7869-9c4a-590203690c0a";
const TRAIL_APP_ID = "01990bf2-ea7c-7973-807d-b623f473ad7c";

const headers = {
  "Content-Type": "application/json",
  "Herd-Trail-App-Id": TRAIL_APP_ID,
};

export interface UserInputs {
  [nodeId: string]: {
    [inputPath: string]: {
      value: string;
    };
  };
}

export interface EvaluationRequest {
  walletAddress: string;
  userInputs: UserInputs;
  execution: { type: "latest" } | { type: "new" } | { type: "manual"; executionId: string };
}

export interface EvaluationResponse {
  finalInputValues: Record<string, string>;
  payableAmount: string;
  contractAddress: string;
  callData: string;
}

export interface ExecutionRequest {
  nodeId: string;
  transactionHash: string;
  walletAddress: string;
  execution: { type: "latest" } | { type: "new" } | { type: "manual"; executionId: string };
}

export async function evaluateStep(
  stepNumber: number,
  request: EvaluationRequest
): Promise<EvaluationResponse> {
  const url = `${TRAIL_API_BASE}/trails/${TRAIL_ID}/versions/${VERSION_ID}/steps/${stepNumber}/evaluations`;
  
  console.log("Evaluation request:", request);
  
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Evaluation error:", error);
    throw new Error(`Evaluation failed: ${error}`);
  }

  const data = await response.json();
  console.log("Evaluation response:", data);
  return data;
}

export async function submitExecution(request: ExecutionRequest): Promise<any> {
  const url = `${TRAIL_API_BASE}/trails/${TRAIL_ID}/versions/${VERSION_ID}/executions`;
  
  console.log("Execution request:", request);
  
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Execution error:", error);
    throw new Error(`Execution failed: ${error}`);
  }

  const data = await response.json();
  console.log("Execution response:", data);
  return data;
}

export async function getExecutionHistory(walletAddresses: string[] = []) {
  const url = `${TRAIL_API_BASE}/trails/${TRAIL_ID}/versions/${VERSION_ID}/executions/query`;
  
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ walletAddresses }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch execution history");
  }

  return response.json();
}

export async function readNode(nodeId: string, walletAddress: string, userInputs: UserInputs, executionId?: string) {
  const url = `${TRAIL_API_BASE}/trails/${TRAIL_ID}/versions/${VERSION_ID}/nodes/${nodeId}/read`;
  
  const request = {
    walletAddress,
    userInputs,
    execution: executionId 
      ? { type: "manual" as const, executionId } 
      : { type: "latest" as const }
  };
  
  console.log("Read node request:", request);
  
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to read node");
  }

  const data = await response.json();
  console.log("Read node response:", data);
  return data;
}