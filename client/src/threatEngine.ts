/*
 * GuardianMesh Dynamic Heuristic-Based Threat Engine
 * A lightweight security scanner for AI interactions and MCP protocol patterns.
 * Improved: Intent analysis, pattern recognition, and better heuristics for unknown content.
 */

export type ThreatCategory =
  | "Prompt Injection"
  | "Indirect Prompt Injection"
  | "Command Injection"
  | "Credential Theft"
  | "Data Exfiltration"
  | "SQL Injection"
  | "Cross Site Scripting"
  | "Path Traversal"
  | "Policy Violation"
  | "Malicious Prompt"
  | "Social Engineering"
  | "Sensitive Data Exposure"
  | "Supply Chain Attack"
  | "Suspicious Repository";

export interface ThreatAnalysis {
  riskScore: number;
  confidence: number;
  category: ThreatCategory;
  detectedThreats: string[];
  explanation: string;
  recommendation: string;
  timestamp: string;
  status: "SAFE" | "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
}

const THREAT_RULES = [
  {
    id: "prompt_injection",
    name: "Prompt Injection",
    patterns: [
      /ignore previous instructions/i, /disregard all prior/i, /system override/i, /new role:/i, /you are now/i, /developer mode/i, /jailbreak/i,
      /act as a/i, /assume the role of/i, /forget everything/i, /print everything above/i, /summarize the above conversation and then/i
    ],
    category: "Prompt Injection" as ThreatCategory,
    weight: 45
  },
  {
    id: "indirect_prompt_injection",
    name: "Indirect Prompt Injection",
    patterns: [
      /from the following document, extract/i, /based on the content of this page/i, /read the attached file and then/i,
      /use the information from the website/i, /summarize the text from the URL/i
    ],
    category: "Indirect Prompt Injection" as ThreatCategory,
    weight: 40
  },
  {
    id: "command_injection",
    name: "Command Injection",
    patterns: [
      /;\s*rm -rf/i, /\|\s*bash/i, /`\s*curl/i, /\$\(.*\)/, /&\s*nc/i, />\s*\/etc\//, /exec\(/i, /system\(/i, /eval\(/i,
      /subprocess\.run/i, /os\.system/i, /shell_exec/i, /passthru/i, /proc_open/i, /Runtime\.getRuntime\(\)\.exec/i
    ],
    category: "Command Injection" as ThreatCategory,
    weight: 50
  },
  {
    id: "sql_injection",
    name: "SQL Injection",
    patterns: [
      /\'\s*OR\s*\'1\'=\'1/i, /UNION\s+SELECT/i, /DROP\s+TABLE/i, /--;/i, /xp_cmdshell/i, /SELECT\s+\*\s+FROM/i,
      /INSERT\s+INTO/i, /UPDATE\s+SET/i, /DELETE\s+FROM/i, /WAITFOR\s+DELAY/i, /BENCHMARK\(/i
    ],
    category: "SQL Injection" as ThreatCategory,
    weight: 45
  },
  {
    id: "xss",
    name: "Cross Site Scripting",
    patterns: [
      /<script/i, /javascript:/i, /onerror=/i, /onload=/i, /alert\(/i, /document\.cookie/i, /<img\s+src=x\s+onerror=/i,
      /<svg\s+onload=/i, /<body\s+onload=/i, /eval\(atob\(/i
    ],
    category: "Cross Site Scripting" as ThreatCategory,
    weight: 35
  },
  {
    id: "secrets_api_keys",
    name: "Secrets/API Keys",
    patterns: [
      /xox[pb]-[0-9]{12}/, // Slack
      /AIza[0-9A-Za-z-_]{35}/, // Google API
      /sk-[a-zA-Z0-9]{48}/, // OpenAI
      /gh[pous]_[a-zA-Z0-9]{36}/, // GitHub
      /pk_live_[0-9a-zA-Z]{24}/, // Stripe Live
      /rk_live_[0-9a-zA-Z]{24}/, // Stripe Restricted
      /sq0csp-[0-9A-Za-z\-_]{43}/, // Square
      /EAACEdEose0cBA[0-9A-Za-z]+/ // Facebook
    ],
    category: "Credential Theft" as ThreatCategory,
    weight: 60
  },
  {
    id: "ssh_keys",
    name: "SSH Keys",
    patterns: [
      /-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/,
      /-----END (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----/
    ],
    category: "Credential Theft" as ThreatCategory,
    weight: 65
  },
  {
    id: "system_prompt_override",
    name: "System Prompt Override",
    patterns: [
      /you must ignore/i, /override your previous instructions/i, /as a \w+ you must/i, /your new identity is/i,
      /disregard all security policies/i, /elevated privileges/i
    ],
    category: "Policy Violation" as ThreatCategory,
    weight: 50
  },
  {
    id: "role_hijacking",
    name: "Role Hijacking",
    patterns: [
      /you are now a system administrator/i, /act as a root user/i, /impersonate a developer/i, /your role is now/i,
      /take control of the system/i
    ],
    category: "Policy Violation" as ThreatCategory,
    weight: 55
  },
  {
    id: "suspicious_urls",
    name: "Suspicious URLs",
    patterns: [
      /https?:\/\/(?!(github\.com|google\.com|slack\.com|microsoft\.com|openai\.com|cdn\.jsdelivr\.net|unpkg\.com))[^\s]{20,}\.(zip|tar|gz|exe|sh|bat|ps1|js|php)/i,
      /https?:\/\/[^\s]*@/i, // URL with embedded credentials
      /data:text\/html;base64,/i // Base64 encoded HTML
    ],
    category: "Malicious Prompt" as ThreatCategory,
    weight: 40
  },
  {
    id: "phishing",
    name: "Phishing",
    patterns: [
      /verify your account/i, /urgent action required/i, /click here to reset your password/i, /your account has been compromised/i,
      /confirm your details/i, /suspicious login attempt/i, /prize winner/i, /claim your reward/i
    ],
    category: "Social Engineering" as ThreatCategory,
    weight: 40
  },
  {
    id: "malware_commands",
    name: "Malware Commands",
    patterns: [
      /Invoke-Expression/i, /powershell -enc/i, /mshta/i, /regsvr32/i, /certutil -urlcache/i, /bitsadmin/i,
      /wscript/i, /cscript/i, /rundll32/i, /System\.Diagnostics\.Process\.Start/i
    ],
    category: "Command Injection" as ThreatCategory,
    weight: 55
  },
  {
    id: "dangerous_shell_commands",
    name: "Dangerous Shell Commands",
    patterns: [
      /sudo\s+rm -rf/i, /dd\s+if=\/dev\/zero/i, /mkfs\./i, /chattr -i/i, /chmod\s+\d{3}\s+\//i, /iptables -F/i,
      /ufw disable/i, /setenforce 0/i, /systemctl stop/i, /kill -9/i
    ],
    category: "Command Injection" as ThreatCategory,
    weight: 50
  },
  {
    id: "encoded_payloads",
    name: "Encoded Payloads",
    patterns: [
      /eval\(atob\(/i, /base64 -d/i, /echo [A-Za-z0-9+/=]+\s*\|\s*base64 -d/i, /\%[0-9a-fA-F]{2}/, // URL encoding
      /\\x[0-9a-fA-F]{2}/ // Hex encoding
    ],
    category: "Data Exfiltration" as ThreatCategory,
    weight: 40
  },
  {
    id: "sensitive_data_exposure",
    name: "Sensitive Data Exposure",
    patterns: [
      /credit card number/i, /social security number/i, /SSN/i, /CVV/i, /bank account/i, /private key/i,
      /confidential document/i, /user data dump/i, /database backup/i
    ],
    category: "Sensitive Data Exposure" as ThreatCategory,
    weight: 45
  },
  {
    id: "suspicious_repository",
    name: "Suspicious Repository",
    patterns: [
      /github\.com\/[^\/]+\/[^\/]+\/(raw|blob)\/master\/.*(install|setup|run)\.(sh|ps1|py)/i,
      /gitlab\.com\/[^\/]+\/[^\/]+\/(raw|blob)\/master\/.*(install|setup|run)\.(sh|ps1|py)/i,
      /bitbucket\.org\/[^\/]+\/[^\/]+\/raw\/master\/.*(install|setup|run)\.(sh|ps1|py)/i
    ],
    category: "Supply Chain Attack" as ThreatCategory,
    weight: 50
  }
];

const SENSITIVE_WORDS = ["password", "secret", "token", "key", "credential", "admin", "root", "sudo", "config", "env", "private", "confidential", "access", "database", "server", "api", "backup"];
const DANGEROUS_ACTION_VERBS = ["delete", "drop", "remove", "upload", "send", "post", "execute", "run", "download", "bypass", "modify", "extract", "dump", "create", "alter", "destroy", "wipe", "format", "erase"];
const INTENT_KEYWORDS = {
  dataAccess: ["read", "access", "retrieve", "fetch", "get", "query", "select", "extract", "export"],
  dataModification: ["update", "modify", "change", "edit", "alter", "set", "insert", "write"],
  systemControl: ["control", "manage", "administer", "configure", "setup", "deploy", "install"],
  dataExfiltration: ["exfiltrate", "leak", "steal", "copy", "dump", "export", "transmit", "send"],
  privilegeEscalation: ["escalate", "elevate", "promote", "grant", "sudo", "root", "admin"]
};

function analyzeIntent(content: string): { intentScore: number; detectedIntents: string[] } {
  let intentScore = 0;
  const detectedIntents: string[] = [];
  const lowerContent = content.toLowerCase();

  // Check for data access intent combined with sensitive targets
  const dataAccessMatch = Object.keys(INTENT_KEYWORDS.dataAccess).some(verb => lowerContent.includes(verb));
  const sensitiveTargetMatch = SENSITIVE_WORDS.some(word => lowerContent.includes(word));
  if (dataAccessMatch && sensitiveTargetMatch) {
    intentScore += 15;
    detectedIntents.push("Sensitive Data Access Attempt");
  }

  // Check for data modification intent
  const modifyMatch = Object.keys(INTENT_KEYWORDS.dataModification).some(verb => lowerContent.includes(verb));
  if (modifyMatch && sensitiveTargetMatch) {
    intentScore += 20;
    detectedIntents.push("Unauthorized Modification");
  }

  // Check for privilege escalation intent
  const privEscMatch = Object.keys(INTENT_KEYWORDS.privilegeEscalation).some(verb => lowerContent.includes(verb));
  if (privEscMatch) {
    intentScore += 25;
    detectedIntents.push("Privilege Escalation Attempt");
  }

  // Check for data exfiltration intent
  const exfilMatch = Object.keys(INTENT_KEYWORDS.dataExfiltration).some(verb => lowerContent.includes(verb));
  if (exfilMatch) {
    intentScore += 30;
    detectedIntents.push("Data Exfiltration Intent");
  }

  return { intentScore, detectedIntents };
}

function analyzePatterns(content: string): { patternScore: number; patterns: string[] } {
  let patternScore = 0;
  const patterns: string[] = [];

  // Check for code patterns that might be injected
  if (/<[a-z][\s\S]*>/i.test(content)) {
    patternScore += 8;
    patterns.push("HTML/XML Pattern");
  }

  if (/\b(function|var|const|let|class|async|await|import|export)\b/i.test(content)) {
    patternScore += 10;
    patterns.push("Code Pattern");
  }

  if (/\$\{.*\}/i.test(content) || /\$\(.*\)/i.test(content)) {
    patternScore += 12;
    patterns.push("Template/Command Substitution");
  }

  // Check for suspicious file operations
  if (/\.(sh|bat|ps1|exe|dll|so|dylib|py|rb|php|js|jar|zip|tar|gz)\b/i.test(content)) {
    patternScore += 10;
    patterns.push("Executable File Reference");
  }

  // Check for network operations
  if (/curl|wget|nc|netcat|telnet|ssh|ftp|http/i.test(content)) {
    patternScore += 8;
    patterns.push("Network Operation");
  }

  // Check for environment/config access
  if (/env|config|\.env|\.config|\.git|\.ssh|\/etc\/|\/root|\/home/i.test(content)) {
    patternScore += 12;
    patterns.push("System Configuration Access");
  }

  return { patternScore, patterns };
}

export function analyzeThreat(content: string): ThreatAnalysis {
  if (!content || content.trim().length === 0) {
    return {
      riskScore: 0,
      confidence: 100,
      category: "Policy Violation",
      detectedThreats: [],
      explanation: "No content provided for analysis.",
      recommendation: "Please provide interaction content to scan.",
      timestamp: new Date().toISOString(),
      status: "SAFE"
    };
  }

  let baseScore = 0;
  const detectedThreats: string[] = [];
  const matchedCategories: ThreatCategory[] = [];

  // 1. Rule-based detection
  THREAT_RULES.forEach(rule => {
    let matched = false;
    rule.patterns.forEach(pattern => {
      if (pattern.test(content)) {
        matched = true;
      }
    });

    if (matched) {
      baseScore += rule.weight;
      detectedThreats.push(rule.name);
      matchedCategories.push(rule.category);
    }
  });

  // 2. Intent Analysis
  const { intentScore, detectedIntents } = analyzeIntent(content);
  baseScore += intentScore;
  detectedThreats.push(...detectedIntents);

  // 3. Pattern Analysis
  const { patternScore, patterns } = analyzePatterns(content);
  baseScore += patternScore;
  detectedThreats.push(...patterns);

  // 4. Keyword & Verb Analysis
  const words = content.toLowerCase().split(/\W+/);
  const sensitiveMatchCount = words.filter(w => SENSITIVE_WORDS.includes(w)).length;
  const dangerousVerbCount = words.filter(w => DANGEROUS_ACTION_VERBS.includes(w)).length;

  if (sensitiveMatchCount > 0) {
    baseScore += Math.min(sensitiveMatchCount * 5, 20);
    detectedThreats.push(`Sensitive Keywords (${sensitiveMatchCount})`);
  }

  if (dangerousVerbCount > 0) {
    baseScore += Math.min(dangerousVerbCount * 8, 25);
    detectedThreats.push(`Dangerous Actions (${dangerousVerbCount})`);
  }

  // 5. Heuristic Adjustments for unknown/low-score content
  // Even if no direct rule matches, estimate risk based on content characteristics
  if (baseScore === 0 && content.length > 20) {
    // Check for suspicious patterns even without explicit matches
    if (content.includes("http") || content.includes("://")) {
      baseScore += 5;
      detectedThreats.push("URL Reference");
    }

    // Check for unusual character patterns that might indicate encoding
    if (/[\\x%][\da-f]{2}/i.test(content)) {
      baseScore += 8;
      detectedThreats.push("Encoded Content");
    }

    // Check for code-like structures
    if (/[\{\}\[\]\(\)];/.test(content)) {
      baseScore += 5;
      detectedThreats.push("Code-like Structure");
    }

    // Check for suspicious punctuation/special characters
    const specialCharCount = (content.match(/[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~]/g) || []).length;
    if (specialCharCount > content.length * 0.15) {
      baseScore += 8;
      detectedThreats.push("High Special Character Density");
    }
  }

  // Calculate Final Score (capped at 100)
  const riskScore = Math.min(Math.max(baseScore, 0), 100);

  // Calculate Confidence
  let confidence = 30; // Base confidence
  confidence += Math.min(detectedThreats.length * 5, 30); // Each detected threat adds confidence
  confidence += Math.floor(riskScore / 5); // Higher risk score increases confidence
  confidence += Math.min(content.length / 200, 15); // Longer content, up to a point
  confidence = Math.min(confidence, 99); // Cap confidence at 99%

  // Determine Primary Category
  let primaryCategory: ThreatCategory = "Policy Violation";
  if (matchedCategories.length > 0) {
    // Prioritize categories based on weight or specific threat types
    const sortedCategories = [...matchedCategories].sort((a, b) => {
      const weightA = THREAT_RULES.find(r => r.category === a)?.weight || 0;
      const weightB = THREAT_RULES.find(r => r.category === b)?.weight || 0;
      return weightB - weightA;
    });
    primaryCategory = sortedCategories[0];
  } else if (riskScore > 60) {
    primaryCategory = "Malicious Prompt";
  } else if (riskScore > 30) {
    primaryCategory = "Policy Violation";
  } else if (riskScore > 0) {
    primaryCategory = "Policy Violation";
  }

  // Determine Status
  let status: "SAFE" | "LOW RISK" | "MEDIUM RISK" | "HIGH RISK";
  if (riskScore <= 20) {
    status = "SAFE";
  } else if (riskScore <= 50) {
    status = "LOW RISK";
  } else if (riskScore <= 70) {
    status = "MEDIUM RISK";
  } else {
    status = "HIGH RISK";
  }

  // Generate Explanation & Recommendation
  let explanation = "";
  let recommendation = "";

  if (riskScore === 0) {
    explanation = "The content appears to be safe. No significant threat patterns were detected.";
    recommendation = "No action required. This interaction is within normal parameters.";
  } else if (riskScore <= 20) {
    explanation = `Minimal risk detected. The content shows some characteristics that warrant attention: ${detectedThreats.slice(0, 2).join(", ")}.`;
    recommendation = "Monitor this interaction. No immediate action required.";
  } else if (riskScore <= 50) {
    explanation = `Low to moderate risk detected. Identified ${detectedThreats.length} suspicious indicators: ${detectedThreats.slice(0, 3).join(", ")}. The interaction shows patterns associated with ${primaryCategory.toLowerCase()}.`;
    recommendation = "Review this interaction carefully. Consider additional validation before proceeding.";
  } else if (riskScore <= 70) {
    explanation = `Moderate to high risk detected. Found ${detectedThreats.length} concerning patterns: ${detectedThreats.slice(0, 4).join(", ")}. Strong indicators of ${primaryCategory.toLowerCase()}.`;
    recommendation = "HIGH: Exercise caution. This interaction should be reviewed by a security administrator before proceeding.";
  } else {
    explanation = `Critical risk detected. Multiple severe threat indicators identified: ${detectedThreats.slice(0, 5).join(", ")}. This interaction exhibits clear signs of ${primaryCategory.toLowerCase()}.`;
    recommendation = "CRITICAL: Block this interaction immediately. Revoke any associated API keys and audit the agent's recent activities.";
  }

  return {
    riskScore,
    confidence: Math.round(confidence),
    category: primaryCategory,
    detectedThreats: Array.from(new Set(detectedThreats)), // Remove duplicates
    explanation,
    recommendation,
    timestamp: new Date().toISOString(),
    status
  };
}
