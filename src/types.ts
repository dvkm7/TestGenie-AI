export type TestCategory = 'NORMAL' | 'BOUNDARY' | 'EDGE';

export type TestStatus = 'pending' | 'running' | 'passed' | 'failed' | 'error' | 'timed_out';

export interface TestCase {
  id: string;
  name: string;
  category: TestCategory;
  description: string;
  code: string;
  inputs_summary?: string;
  expected_output?: string;
  expected_behavior?: string;
}

export interface SingleTestResult {
  id: string;
  name: string;
  status: TestStatus;
  execution_time_ms: number;
  error_message?: string | null;
  traceback?: string | null;
  stdout?: string | null;
  stderr?: string | null;
}

export interface ExecutionSummary {
  total: number;
  passed: number;
  failed: number;
  errors: number;
  pass_percentage: number;
}

export interface ExecuteTestsResponse {
  success: boolean;
  total_duration_ms: number;
  compile_duration_ms: number;
  results: SingleTestResult[];
  summary: ExecutionSummary;
  raw_terminal_output?: string;
}

export interface GenerateTestsResponse {
  success: boolean;
  summary: string;
  targeted_function?: string;
  tests: TestCase[];
  categories_breakdown: Record<string, number>;
  generation_time_ms?: number;
  error?: string;
}

export interface CodePreset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  context: string;
  code: string;
  buggyCode?: string;
  defaultTests: TestCase[];
}

export type UserRole = 'student' | 'evaluator';

export type MfaMethod = 'bits_duo' | 'email_otp' | 'authenticator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  campus?: string;
  department?: string;
  avatarUrl?: string;
  token?: string;
  mfaEnabled?: boolean;
  mfaMethod?: MfaMethod;
  isMfaVerified?: boolean;
  trustedDevice?: boolean;
  lastMfaVerifiedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  message?: string;
}

