import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Section from '../components/Section';

describe('Section', () => {
  it('renders children', () => {
    render(
      <Section>
        <p>Test content</p>
      </Section>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('wraps children in container by default', () => {
    render(
      <Section>
        <p>Test content</p>
      </Section>
    );

    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveClass('container');
  });

  it('does not wrap in container when container is false', () => {
    render(
      <Section container={false}>
        <p>Test content</p>
      </Section>
    );

    const element = screen.getByText('Test content');
    expect(element.parentElement).not.toHaveClass('container');
  });

  it('applies default padding classes', () => {
    const { container } = render(
      <Section>
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('py-12', 'md:py-16', 'lg:py-24');
  });

  it('does not apply padding when noPadding is true', () => {
    const { container } = render(
      <Section noPadding>
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).not.toHaveClass('py-12');
    expect(section).not.toHaveClass('md:py-16');
    expect(section).not.toHaveClass('lg:py-24');
  });

  it('applies primary background class', () => {
    const { container } = render(
      <Section background="primary">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-background-primary');
  });

  it('applies secondary background class', () => {
    const { container } = render(
      <Section background="secondary">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-background-secondary');
  });

  it('applies alternative background class', () => {
    const { container } = render(
      <Section background="alternative">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-background-alternative');
  });

  it('does not apply background class when background is none', () => {
    const { container } = render(
      <Section background="none">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).not.toHaveClass('bg-background-primary');
    expect(section).not.toHaveClass('bg-background-secondary');
    expect(section).not.toHaveClass('bg-background-alternative');
  });

  it('applies id attribute when provided', () => {
    const { container } = render(
      <Section id="test-section">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('#test-section');
    expect(section).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(
      <Section className="custom-class">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('custom-class');
  });

  it('combines multiple props correctly', () => {
    const { container } = render(
      <Section id="combined-section" background="secondary" className="extra-class">
        <p>Test content</p>
      </Section>
    );

    const section = container.querySelector('#combined-section');
    expect(section).toHaveClass('py-12', 'md:py-16', 'lg:py-24');
    expect(section).toHaveClass('bg-background-secondary');
    expect(section).toHaveClass('extra-class');
  });
});
