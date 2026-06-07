#!/usr/bin/env python3
"""
Generate steering files for coding-skills Kiro Power from source skills directory.

Produces TWO files per category:
  - skills-{category}.md  → SKILL.md content (core rules, triggers, anti-patterns)
  - refs-{category}.md    → References content (code examples, implementation guides)

Evals are NOT included (they're for CI/testing, not runtime).
"""

import os
import sys
from pathlib import Path

SKILLS_SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).parent.parent.parent / "skills"
STEERING_DIR = Path(__file__).parent.parent / "steering"

# Categories to skip
SKIP_CATEGORIES = {"specialists"}

FRONTMATTER_MANUAL = "---\ninclusion: manual\n---\n\n"


def read_file_safe(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"  WARN: Cannot read {path}: {e}")
        return ""


def get_categories(source: Path) -> list:
    categories = []
    for item in sorted(source.iterdir()):
        if item.is_dir() and item.name not in SKIP_CATEGORIES:
            categories.append(item)
    return categories


def get_skills_in_category(category_dir: Path) -> list:
    skills = []
    for item in sorted(category_dir.iterdir()):
        if item.is_dir():
            skill_file = item / "SKILL.md"
            if skill_file.exists():
                skills.append(item)
    return skills


def get_references(skill_dir: Path) -> list:
    """Get all reference markdown files for a skill."""
    refs_dir = skill_dir / "references"
    if not refs_dir.exists():
        return []
    refs = []
    for f in sorted(refs_dir.iterdir()):
        if f.suffix == ".md":
            refs.append(f)
    return refs


def generate_skills_steering(category_dir: Path) -> str:
    """Generate the main skills steering file (SKILL.md content only)."""
    category_name = category_dir.name
    skills = get_skills_in_category(category_dir)
    if not skills:
        return ""

    # Read _INDEX.md
    index_file = category_dir / "_INDEX.md"
    index_content = ""
    if index_file.exists():
        index_content = index_file.read_text(encoding="utf-8")
        index_content = index_content.replace(
            "<!-- AUTO-GENERATED from SKILL.md frontmatters — do not edit manually -->\n", ""
        )

    lines = []
    lines.append(FRONTMATTER_MANUAL)
    lines.append(f"# Skills: {category_name}\n\n")
    lines.append(f"> {len(skills)} skills. Load when editing {category_name} files.\n")
    lines.append(f"> For code examples and implementation patterns, load `refs-{category_name}.md`.\n\n")

    if index_content:
        lines.append("## Index\n\n")
        lines.append(index_content)
        lines.append("\n\n---\n\n")

    lines.append("## Skills\n\n")
    for skill_dir in skills:
        skill_content = read_file_safe(skill_dir / "SKILL.md")
        if skill_content:
            lines.append(f"### {skill_dir.name}\n\n")
            lines.append(skill_content)
            lines.append("\n\n---\n\n")

    return "".join(lines)


def generate_refs_steering(category_dir: Path) -> str:
    """Generate the references steering file (code examples, patterns)."""
    category_name = category_dir.name
    skills = get_skills_in_category(category_dir)
    if not skills:
        return ""

    # Collect all references
    all_refs = []
    for skill_dir in skills:
        refs = get_references(skill_dir)
        if refs:
            all_refs.append((skill_dir.name, refs))

    if not all_refs:
        return ""

    lines = []
    lines.append(FRONTMATTER_MANUAL)
    lines.append(f"# References: {category_name}\n\n")
    total_refs = sum(len(refs) for _, refs in all_refs)
    lines.append(f"> {total_refs} reference files with code examples and implementation patterns.\n")
    lines.append(f"> Load this file when you need detailed examples beyond the core rules in `skills-{category_name}.md`.\n\n")

    for skill_name, refs in all_refs:
        lines.append(f"## {skill_name}\n\n")
        for ref_file in refs:
            ref_content = read_file_safe(ref_file)
            if ref_content:
                lines.append(f"### {ref_file.stem}\n\n")
                lines.append(ref_content)
                lines.append("\n\n---\n\n")

    return "".join(lines)


def main():
    if not SKILLS_SOURCE.exists():
        print(f"ERROR: Skills source not found: {SKILLS_SOURCE}")
        sys.exit(1)

    STEERING_DIR.mkdir(parents=True, exist_ok=True)

    categories = get_categories(SKILLS_SOURCE)
    print(f"Found {len(categories)} categories in {SKILLS_SOURCE}\n")

    total_skills = 0
    total_refs = 0
    skills_generated = []
    refs_generated = []

    for category_dir in categories:
        skills = get_skills_in_category(category_dir)
        if not skills:
            continue

        category_name = category_dir.name

        # Generate skills file
        skills_content = generate_skills_steering(category_dir)
        if skills_content:
            output = STEERING_DIR / f"skills-{category_name}.md"
            output.write_text(skills_content, encoding="utf-8")
            total_skills += len(skills)
            skills_generated.append((category_name, len(skills)))
            print(f"  ✅ skills-{category_name}.md ({len(skills)} skills)")

        # Generate refs file
        refs_content = generate_refs_steering(category_dir)
        if refs_content:
            output = STEERING_DIR / f"refs-{category_name}.md"
            output.write_text(refs_content, encoding="utf-8")
            ref_count = sum(
                len(get_references(sd)) for sd in skills
            )
            total_refs += ref_count
            refs_generated.append((category_name, ref_count))
            print(f"  📚 refs-{category_name}.md ({ref_count} references)")

    print(f"\n{'='*60}")
    print(f"Skills: {len(skills_generated)} files, {total_skills} skills")
    print(f"Refs:   {len(refs_generated)} files, {total_refs} references")
    print(f"Total steering files: {len(skills_generated) + len(refs_generated)}")
    print(f"\nMapping:")
    print(f"{'Category':<25} {'Skills':<8} {'Refs':<8} {'Files'}")
    print("-" * 70)
    for name, count in skills_generated:
        ref_count = next((r for n, r in refs_generated if n == name), 0)
        files = f"skills-{name}.md"
        if ref_count > 0:
            files += f" + refs-{name}.md"
        print(f"{name:<25} {count:<8} {ref_count:<8} {files}")


if __name__ == "__main__":
    main()
