import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Use built-in fonts to avoid network fetches during build
Font.registerHyphenationCallback((word) => [word]);

const colors = {
  dark: "#0f172a",
  slate: "#475569",
  muted: "#94a3b8",
  border: "#e2e8f0",
  emerald: "#059669",
  red: "#dc2626",
  orange: "#ea580c",
  yellow: "#ca8a04",
  green: "#16a34a",
  bgLight: "#f8fafc",
  bgEmerald: "#ecfdf5",
  bgRed: "#fef2f2",
  bgYellow: "#fefce8",
  bgGray: "#f1f5f9",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.dark,
    padding: 40,
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1.5px solid ${colors.dark}`,
  },
  headerLeft: { flex: 1 },
  brandRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: colors.emerald,
    marginRight: 5,
  },
  brandName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: colors.dark },
  reportTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: colors.dark, marginBottom: 2 },
  reportSubtitle: { fontSize: 9, color: colors.slate },
  headerRight: { alignItems: "flex-end" },
  metaLabel: { fontSize: 7, color: colors.muted, marginBottom: 1, textTransform: "uppercase" },
  metaValue: { fontSize: 9, color: colors.slate, marginBottom: 6 },
  // Score badge
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  scoreNumber: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  scoreLabel: { fontSize: 6, color: colors.muted },
  // Section
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.dark,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `1px solid ${colors.border}`,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Summary cards
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  summaryCard: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.bgLight,
    borderRadius: 4,
    borderLeft: "3px solid #e2e8f0",
  },
  summaryCardValue: { fontSize: 18, fontFamily: "Helvetica-Bold", color: colors.dark },
  summaryCardLabel: { fontSize: 7, color: colors.muted, marginTop: 2 },
  // Table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.bgLight,
    padding: "5 8",
    borderBottom: `1px solid ${colors.border}`,
  },
  tableRow: {
    flexDirection: "row",
    padding: "6 8",
    borderBottom: `0.5px solid ${colors.border}`,
  },
  tableRowAlt: {
    flexDirection: "row",
    padding: "6 8",
    borderBottom: `0.5px solid ${colors.border}`,
    backgroundColor: "#fafafa",
  },
  colStatus: { width: "12%", fontSize: 8 },
  colSeverity: { width: "12%", fontSize: 8 },
  colFinding: { flex: 1, fontSize: 8 },
  colDetails: { width: "30%", fontSize: 7, color: colors.slate },
  tableHeaderText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: colors.muted, textTransform: "uppercase" },
  // Badges
  badge: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 3, fontSize: 7, fontFamily: "Helvetica-Bold" },
  badgeFail: { backgroundColor: "#fee2e2", color: colors.red },
  badgeWarn: { backgroundColor: "#fef9c3", color: "#854d0e" },
  badgePass: { backgroundColor: "#dcfce7", color: colors.green },
  badgeManual: { backgroundColor: "#ede9fe", color: "#6d28d9" },
  badgeCritical: { backgroundColor: "#fee2e2", color: colors.red },
  badgeHigh: { backgroundColor: "#ffedd5", color: colors.orange },
  badgeMedium: { backgroundColor: "#fef9c3", color: "#854d0e" },
  badgeLow: { backgroundColor: colors.bgGray, color: colors.slate },
  // Checklist
  checklistRow: { flexDirection: "row", padding: "5 8", borderBottom: `0.5px solid ${colors.border}` },
  checklistRowAlt: { flexDirection: "row", padding: "5 8", borderBottom: `0.5px solid ${colors.border}`, backgroundColor: "#fafafa" },
  checkCol: { width: "40%", fontSize: 8 },
  checkColStatus: { width: "18%", fontSize: 8 },
  checkColNotes: { flex: 1, fontSize: 7, color: colors.slate },
  // Tasks
  taskRow: { flexDirection: "row", padding: "5 8", borderBottom: `0.5px solid ${colors.border}` },
  taskRowAlt: { flexDirection: "row", padding: "5 8", borderBottom: `0.5px solid ${colors.border}`, backgroundColor: "#fafafa" },
  taskColTitle: { flex: 1, fontSize: 8 },
  taskColSeverity: { width: "14%", fontSize: 8 },
  taskColStatus: { width: "16%", fontSize: 8 },
  taskColOwner: { width: "18%", fontSize: 7, color: colors.slate },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `0.5px solid ${colors.border}`,
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: colors.muted },
});

function statusBadgeStyle(status: string) {
  switch (status) {
    case "FAIL": return styles.badgeFail;
    case "WARNING": return styles.badgeWarn;
    case "PASS": return styles.badgePass;
    default: return styles.badgeManual;
  }
}

function severityBadgeStyle(severity: string) {
  switch (severity) {
    case "CRITICAL": return styles.badgeCritical;
    case "HIGH": return styles.badgeHigh;
    case "MEDIUM": return styles.badgeMedium;
    default: return styles.badgeLow;
  }
}

function scoreColor(score: number | null | undefined) {
  if (score == null) return { bg: colors.bgGray, text: colors.muted };
  if (score >= 70) return { bg: "#dcfce7", text: colors.green };
  if (score >= 40) return { bg: "#fef9c3", text: colors.yellow };
  return { bg: "#fee2e2", text: colors.red };
}

function checklistStatusStyle(status: string) {
  switch (status) {
    case "COMPLETE": return styles.badgePass;
    case "IN_PROGRESS": return styles.badgeMedium;
    case "NOT_APPLICABLE": return styles.badgeLow;
    default: return styles.badgeManual;
  }
}

function taskStatusStyle(status: string) {
  switch (status) {
    case "DONE": return styles.badgePass;
    case "IN_PROGRESS": return styles.badgeMedium;
    case "WONT_FIX": return styles.badgeLow;
    default: return styles.badgeFail;
  }
}

export interface AuditReportData {
  project: {
    name: string;
    domain: string;
    region: string;
    notes?: string | null;
    createdAt: Date | string;
  };
  latestScan?: {
    score?: number | null;
    completedAt?: Date | string | null;
    findings: Array<{
      key: string;
      label: string;
      status: string;
      severity: string;
      details?: string | null;
    }>;
  } | null;
  checklistItems: Array<{
    key: string;
    label: string;
    status: string;
    notes?: string | null;
  }>;
  tasks: Array<{
    title: string;
    severity: string;
    status: string;
    owner?: string | null;
    dueDate?: Date | string | null;
  }>;
  generatedAt: Date | string;
}

function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function AuditReportDocument({ data }: { data: AuditReportData }) {
  const { project, latestScan, checklistItems, tasks, generatedAt } = data;
  const score = latestScan?.score;
  const sc = scoreColor(score);

  const findings = latestScan?.findings ?? [];
  const failCount = findings.filter((f) => f.status === "FAIL").length;
  const warnCount = findings.filter((f) => f.status === "WARNING").length;
  const passCount = findings.filter((f) => f.status === "PASS").length;

  const openTasks = tasks.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
  const completedChecklist = checklistItems.filter((c) => c.status === "COMPLETE").length;

  return (
    <Document title={`${project.name} — Privacy Audit Report`} author="PrivacyAudit">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandName}>PrivacyAudit</Text>
            </View>
            <Text style={styles.reportTitle}>{project.name}</Text>
            <Text style={styles.reportSubtitle}>
              Privacy Compliance Audit Report · {project.domain} · {project.region}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {score != null && (
              <>
                <View style={[styles.scoreBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.scoreNumber, { color: sc.text }]}>{score}</Text>
                </View>
                <Text style={styles.scoreLabel}>Compliance Score</Text>
              </>
            )}
            <Text style={[styles.metaLabel, { marginTop: 6 }]}>Generated</Text>
            <Text style={styles.metaValue}>{fmtDate(generatedAt)}</Text>
            {latestScan?.completedAt && (
              <>
                <Text style={styles.metaLabel}>Last Scanned</Text>
                <Text style={styles.metaValue}>{fmtDate(latestScan.completedAt)}</Text>
              </>
            )}
          </View>
        </View>

        {/* Summary Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { borderLeftColor: colors.red }]}>
              <Text style={styles.summaryCardValue}>{failCount}</Text>
              <Text style={styles.summaryCardLabel}>Failures</Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: colors.yellow }]}>
              <Text style={styles.summaryCardValue}>{warnCount}</Text>
              <Text style={styles.summaryCardLabel}>Warnings</Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: colors.green }]}>
              <Text style={styles.summaryCardValue}>{passCount}</Text>
              <Text style={styles.summaryCardLabel}>Passing</Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: colors.orange }]}>
              <Text style={styles.summaryCardValue}>{openTasks}</Text>
              <Text style={styles.summaryCardLabel}>Open Tasks</Text>
            </View>
            <View style={[styles.summaryCard, { borderLeftColor: colors.emerald }]}>
              <Text style={styles.summaryCardValue}>{completedChecklist}/{checklistItems.length}</Text>
              <Text style={styles.summaryCardLabel}>Checklist Done</Text>
            </View>
          </View>
          {project.notes && (
            <Text style={{ fontSize: 8, color: colors.slate, marginTop: 4 }}>{project.notes}</Text>
          )}
        </View>

        {/* Scan Findings */}
        {findings.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scan Findings ({findings.length})</Text>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.colStatus]}>Status</Text>
              <Text style={[styles.tableHeaderText, styles.colSeverity]}>Severity</Text>
              <Text style={[styles.tableHeaderText, styles.colFinding]}>Finding</Text>
              <Text style={[styles.tableHeaderText, styles.colDetails]}>Details</Text>
            </View>
            {findings.map((f, i) => (
              <View key={f.key} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <View style={styles.colStatus}>
                  <Text style={[styles.badge, statusBadgeStyle(f.status)]}>{f.status}</Text>
                </View>
                <View style={styles.colSeverity}>
                  <Text style={[styles.badge, severityBadgeStyle(f.severity)]}>{f.severity}</Text>
                </View>
                <Text style={styles.colFinding}>{f.label}</Text>
                <Text style={styles.colDetails}>{f.details ?? ""}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>PrivacyAudit — {project.domain}</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* Page 2: Checklist + Tasks */}
      {(checklistItems.length > 0 || tasks.length > 0) && (
        <Page size="A4" style={styles.page}>
          {/* Checklist */}
          {checklistItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Compliance Checklist ({checklistItems.length} items)</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.checkCol]}>Item</Text>
                <Text style={[styles.tableHeaderText, styles.checkColStatus]}>Status</Text>
                <Text style={[styles.tableHeaderText, styles.checkColNotes]}>Notes</Text>
              </View>
              {checklistItems.map((c, i) => (
                <View key={c.key} style={i % 2 === 0 ? styles.checklistRow : styles.checklistRowAlt}>
                  <Text style={styles.checkCol}>{c.label}</Text>
                  <View style={styles.checkColStatus}>
                    <Text style={[styles.badge, checklistStatusStyle(c.status)]}>{c.status.replace("_", " ")}</Text>
                  </View>
                  <Text style={styles.checkColNotes}>{c.notes ?? ""}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Tasks */}
          {tasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Remediation Tasks ({tasks.length})</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.taskColTitle]}>Task</Text>
                <Text style={[styles.tableHeaderText, styles.taskColSeverity]}>Severity</Text>
                <Text style={[styles.tableHeaderText, styles.taskColStatus]}>Status</Text>
                <Text style={[styles.tableHeaderText, styles.taskColOwner]}>Owner / Due</Text>
              </View>
              {tasks.map((t, i) => (
                <View key={i} style={i % 2 === 0 ? styles.taskRow : styles.taskRowAlt}>
                  <Text style={styles.taskColTitle}>{t.title}</Text>
                  <View style={styles.taskColSeverity}>
                    <Text style={[styles.badge, severityBadgeStyle(t.severity)]}>{t.severity}</Text>
                  </View>
                  <View style={styles.taskColStatus}>
                    <Text style={[styles.badge, taskStatusStyle(t.status)]}>{t.status.replace("_", " ")}</Text>
                  </View>
                  <Text style={styles.taskColOwner}>
                    {t.owner ? `${t.owner}` : ""}
                    {t.owner && t.dueDate ? " · " : ""}
                    {t.dueDate ? fmtDate(t.dueDate) : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>PrivacyAudit — {project.domain}</Text>
            <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </Page>
      )}
    </Document>
  );
}
