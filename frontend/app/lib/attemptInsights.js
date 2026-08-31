export function buildAttemptInsights(attempt, details = []) {
  const passing = attempt?.Assessment?.passingScore || 60;
  const percentage = attempt?.percentage || 0;
  const skill = attempt?.Assessment?.skills || attempt?.Assessment?.jobRole || "Skill";
  const topic = attempt?.Assessment?.topic || "General";
  const difficulty = attempt?.Assessment?.difficulty || "Medium";
  const passed = percentage >= passing;

  const correct = details.filter((item) => item.isCorrect).length;
  const incorrect = details.filter((item) => item.userAnswer && !item.isCorrect).length;
  const unanswered = details.filter((item) => !item.userAnswer).length;
  const accuracy = details.length ? Math.round((correct / details.length) * 100) : percentage;

  let verdict = "Needs Coaching";
  let verdictTone = "amber";
  let headline = "Candidate shows gaps that need follow-up.";

  if (percentage >= 90) {
    verdict = "Outstanding";
    verdictTone = "emerald";
    headline = "Strong mastery — ready for advanced responsibilities.";
  } else if (percentage >= passing) {
    verdict = "On Track";
    verdictTone = "blue";
    headline = "Meets the bar with room to sharpen edge-case knowledge.";
  } else if (percentage >= passing - 15) {
    verdict = "Borderline";
    verdictTone = "amber";
    headline = "Close to passing — targeted revision could flip the outcome.";
  } else {
    verdict = "At Risk";
    verdictTone = "red";
    headline = "Foundational gaps detected — recommend structured upskilling.";
  }

  const strengths = [];
  const gaps = [];

  if (correct > 0) {
    strengths.push(`Answered ${correct}/${details.length} questions correctly in ${skill}.`);
  }
  if (passed) {
    strengths.push(`Cleared the ${passing}% passing threshold at ${difficulty} level.`);
  }
  if (incorrect === 0 && unanswered === 0 && details.length > 0) {
    strengths.push("Perfect run — no incorrect or skipped responses.");
  }

  if (incorrect > 0) {
    gaps.push(`Missed ${incorrect} question${incorrect > 1 ? "s" : ""} on ${topic}.`);
  }
  if (unanswered > 0) {
    gaps.push(`Left ${unanswered} question${unanswered > 1 ? "s" : ""} unanswered — time management may be a factor.`);
  }
  if (!passed) {
    gaps.push(`Scored ${percentage}% vs required ${passing}% for this assessment.`);
  }

  const recommendations = [];
  if (!passed) {
    recommendations.push(`Assign a focused ${topic} refresher before the next attempt.`);
    recommendations.push("Schedule a 15-min review session to walk through incorrect answers.");
  } else if (percentage < 85) {
    recommendations.push(`Move candidate to intermediate ${skill} tasks with mentor check-ins.`);
  } else {
    recommendations.push(`Consider advancing candidate to harder ${skill} assessments.`);
    recommendations.push("Flag profile for fast-track interview pipeline.");
  }

  const coachNote =
    passed && percentage >= 85
      ? `${attempt?.User?.fullName || "This candidate"} demonstrates confident ${topic} understanding. High signal for hiring pipeline.`
      : passed
        ? `Passing score achieved, but inconsistent accuracy suggests coaching on ${topic} edge cases before client-facing work.`
        : `Performance indicates ${topic} fundamentals need reinforcement. A retake after guided study would be the fairest next step.`;

  return {
    verdict,
    verdictTone,
    headline,
    passing,
    passed,
    accuracy,
    correct,
    incorrect,
    unanswered,
    skill,
    topic,
    difficulty,
    strengths: strengths.length ? strengths : ["Completed the full assessment attempt."],
    gaps: gaps.length ? gaps : ["No major gaps flagged — maintain current learning pace."],
    recommendations,
    coachNote,
    topicMastery: [
      { label: "Accuracy", value: accuracy },
      { label: "Completion", value: details.length ? Math.round(((details.length - unanswered) / details.length) * 100) : 100 },
      { label: "Pass Margin", value: Math.max(0, Math.min(100, percentage - passing + 50)) },
    ],
  };
}
