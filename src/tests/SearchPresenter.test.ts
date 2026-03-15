/**
 * src/tests/SearchPresenter.test.ts
 * Tests unitaires — SearchPresenter (validation du formulaire de recherche)
 */
import { describe, it, expect, vi } from "vitest";
import { SearchPresenter } from "@/presenters/SearchPresenter";


const makePresenter = () => {
  const onChange = vi.fn();
  const presenter = new SearchPresenter(onChange);
  return { presenter, onChange };
};

const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
};

const dayAfter = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d;
};


describe("SearchPresenter — validation", () => {

  it("isValid = false par défaut (champs vides)", () => {
    const { presenter } = makePresenter();
    expect(presenter.getViewModel().isValid).toBe(false);
  });

  it("isValid = false si seulement la ville est remplie", () => {
    const { presenter } = makePresenter();
    presenter.onCityChange("Paris");
    expect(presenter.getViewModel().isValid).toBe(false);
  });

  it("isValid = true avec ville + dates valides", () => {
    const { presenter } = makePresenter();
    presenter.onCityChange("Paris");
    presenter.onDateChange(tomorrow(), dayAfter());
    expect(presenter.getViewModel().isValid).toBe(true);
  });

  it("isValid = false si check-out avant check-in", () => {
    const { presenter } = makePresenter();
    presenter.onCityChange("Paris");
    presenter.onDateChange(dayAfter(), tomorrow());
    expect(presenter.getViewModel().isValid).toBe(false);
  });

  it("affiche une erreur si check-out avant check-in", () => {
    const { presenter } = makePresenter();
    presenter.onDateChange(dayAfter(), tomorrow());
    expect(presenter.getViewModel().dateError).toBeDefined();
  });

  it("efface l'erreur quand la ville est corrigée", () => {
    const { presenter } = makePresenter();
    presenter.onCityChange("Paris");
    expect(presenter.getViewModel().cityError).toBeUndefined();
  });
});


describe("SearchPresenter — ViewModel", () => {

  it("met à jour la ville", () => {
    const { presenter } = makePresenter();
    presenter.onCityChange("Nice");
    expect(presenter.getViewModel().city).toBe("Nice");
  });

  it("met à jour les dates", () => {
    const { presenter } = makePresenter();
    const ci = tomorrow();
    const co = dayAfter();
    presenter.onDateChange(ci, co);
    expect(presenter.getViewModel().checkIn).toBe(ci);
    expect(presenter.getViewModel().checkOut).toBe(co);
  });

  it("met à jour le nombre de voyageurs", () => {
    const { presenter } = makePresenter();
    presenter.onGuestCountChange(4);
    expect(presenter.getViewModel().guestCount).toBe(4);
  });

  it("borne le nombre de voyageurs entre 1 et 10", () => {
    const { presenter } = makePresenter();
    presenter.onGuestCountChange(0);
    expect(presenter.getViewModel().guestCount).toBe(1);
    presenter.onGuestCountChange(15);
    expect(presenter.getViewModel().guestCount).toBe(10);
  });

});
