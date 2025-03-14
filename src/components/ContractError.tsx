import { AlertTriangle, FileCode, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export type ContractErrorType = 
  | "NO_PROVIDER" 
  | "UNSUPPORTED_CHAIN" 
  | "MISSING_ADDRESS" 
  | "MISSING_ABI" 
  | "CONTRACT_INIT_ERROR";

interface ContractErrorProps {
  type: ContractErrorType;
  chainId?: number;
  error?: Error;
}

export function ContractError({ type, chainId, error }: ContractErrorProps) {
  const getErrorDetails = () => {
    switch (type) {
      case "NO_PROVIDER":
        return {
          title: "Ethereum Provider Not Found",
          description: "MetaMask or another web3 provider is required but not detected.",
          solution: "Make sure MetaMask extension is installed and unlocked, or use another compatible Ethereum wallet.",
          code: `// Check if provider exists before initializing
if (window.ethereum) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  // Continue with initialization
} else {
  console.error("No Ethereum provider found");
}`
        };
      
      case "UNSUPPORTED_CHAIN":
        return {
          title: "Unsupported Blockchain Network",
          description: `The current network (Chain ID: ${chainId}) is not supported by this application.`,
          solution: "Switch to one of the supported networks in the application settings or add this network to the supported chains configuration.",
          code: `// Add your chain to the supportedChains array in lib/chains.ts
export const supportedChains: SupportedChain[] = [
  {
    id: ${chainId || "YOUR_CHAIN_ID"},
    name: "Your Network Name",
    network: "network-identifier",
    lotteryAddress: "0x...", // Your deployed contract address
  },
  // ... other chains
];`
        };
      
      case "MISSING_ADDRESS":
        return {
          title: "Contract Address Not Found",
          description: "The lottery contract address is missing for the current network.",
          solution: "Deploy your contract to this network and update the address in the chains configuration file.",
          code: `// Update the contract address in lib/chains.ts
export const supportedChains: SupportedChain[] = [
  {
    id: ${chainId || 1},
    name: "Ethereum",
    network: "mainnet",
    lotteryAddress: "0x1234567890123456789012345678901234567890", // Replace with your deployed address
  },
  // ... other chains
];`
        };
      
      case "MISSING_ABI":
        return {
          title: "Contract ABI Not Found",
          description: "The ABI (Application Binary Interface) for the lottery contract is missing or invalid.",
          solution: "Ensure the contract ABI is correctly exported from lib/lottery-abi.ts.",
          code: `// Make sure your ABI is correctly defined in lib/lottery-abi.ts
export const LotteryABI = [
  {
    "inputs": [...],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  // ... other ABI entries
];`
        };
      
      case "CONTRACT_INIT_ERROR":
        return {
          title: "Contract Initialization Error",
          description: "An error occurred while initializing the lottery contract.",
          solution: "Check the console for detailed error information and ensure the contract is deployed correctly.",
          code: `// Error details:
${error?.message || "Unknown error"}`
        };
    }
  };

  const details = getErrorDetails();

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <AlertTitle className="ml-2 text-destructive">{details.title}</AlertTitle>
      <AlertDescription className="text-destructive/90">{details.description}</AlertDescription>
    </Alert>

    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium text-primary">
        <HelpCircle className="h-5 w-5" />
        <h3>How to fix this</h3>
      </div>
      <p className="text-muted-foreground">{details.solution}</p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="code" className="border-primary/10">
          <AccordionTrigger className="flex items-center gap-2 text-primary hover:text-primary/80">
            <FileCode className="h-4 w-4" />
            <span>View Code Example</span>
          </AccordionTrigger>
          <AccordionContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm border border-primary/10">
              <code>{details.code}</code>
            </pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="border-primary/20 hover:bg-primary/5 hover-card-effect"
        >
          Reload Page
        </Button>
      </div>
    </div>
  </div>
  );
}