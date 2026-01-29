"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/navigation";

export default function Header() {
  const t = useTranslations("Header");

  // Состояния
  const [isActive, setIsActive] = useState(false); // Для анимации формы/кнопки
  const [searchValue, setSearchValue] = useState(""); // Текст в инпуте
  const [history, setHistory] = useState<string[]>([]); // Массив истории
  const [isHistoryVisible, setIsHistoryVisible] = useState(false); // Видимость окна истории

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Загрузка истории из LocalStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Ошибка парсинга истории", e);
      }
    }
  }, []);

  // 2. Закрытие истории при клике вне области поиска
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsHistoryVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Функция сохранения и обновления истории в памяти и LocalStorage
  const updateHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Поднимаем текущий запрос в начало и ограничиваем список 5 элементами
    const updated = [
      trimmed,
      ...history.filter((item) => item !== trimmed),
    ].slice(0, 5);

    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  // 3. Общая функция выполнения поиска
  const executeSearch = (query: string) => {
    if (!query.trim()) return;

    // Включаем визуальный отклик (анимация из SCSS)
    setIsActive(true);
    
    // Сохраняем запрос в историю
    updateHistory(query);

    // Убираем фокус с инпута (скрываем системный курсор)
    if (inputRef.current) {
      inputRef.current.blur();
    }

    // Скрываем окно истории после выбора
    setIsHistoryVisible(false);

    console.log("Запрос отправлен:", query);

    // Выключаем анимацию через 150мс. 
    // ВНИМАНИЕ: setSearchValue("") удален, чтобы текст остался в поле.
    setTimeout(() => {
      setIsActive(false);
    }, 150);
  };

  // Обработка сабмита формы (нажатие Enter или иконки лупы)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchValue);
  };

  // Клик по запросу из истории (подставляет текст и сразу ищет)
  const selectFromHistory = (item: string) => {
    setSearchValue(item); // Текст появляется в инпуте
    executeSearch(item);  // Сразу запускается поиск
  };

  // Удаление запроса из истории по клику на крестик
  const removeFromHistory = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation(); // Предотвращаем срабатывание поиска при клике на крестик
    const updated = history.filter((item) => item !== itemToRemove);
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
  };

  return (
    <header className="header">
      {/* Верхняя черная панель */}
      <div className="header__top">
        <div className="container">
          <div className="header__top-w">
            <div className="header__top-empty"></div>
            <div className="summerSale">
              {t("sale")}
              <a href="#">
                <span>{t("shopNow")}</span>
              </a>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      {/* Основная белая навигация */}
      <nav className="header__main">
        <div className="container">
          <div className="header__main-w">
            <Link href="/" className="header__logo">
              Exclusive
            </Link>

            <ul className="header__menu">
              <li><Link href="/">{t("home")}</Link></li>
              <li><Link href="/contact">{t("contact")}</Link></li>
              <li><Link href="/about">{t("about")}</Link></li>
              <li><Link href="/signup">{t("signup")}</Link></li>
            </ul>

            <div className="header__actions">
              {/* Весь блок поиска в одном контейнере для работы useRef и позиционирования истории */}
              <div className="header__search-container" ref={containerRef}>
                <form
                  className={`header__search ${isActive ? "header__search--active" : ""}`}
                  onSubmit={handleFormSubmit}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setIsHistoryVisible(true)}
                    placeholder={t("searchPlaceholder")}
                    className="header__search-input"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className={`header__search-btn ${isActive ? "header__search-btn--active" : ""}`}
                  >
                    <img src="/search-icon.svg" alt="search" />
                  </button>
                </form>

                {/* Выпадающее окно истории поисковых запросов */}
                {isHistoryVisible && history.length > 0 && (
                  <ul className="header__search-history">
                    <li className="header__search-history-title">{t("recentSearches")}</li>
                    {history.map((item, index) => (
                      <li 
                        key={index} 
                        className="header__search-history-item" 
                        onClick={() => selectFromHistory(item)}
                      >
                        <span>{item}</span>
                        <button 
                          className="header__search-history-remove"
                          onClick={(e) => removeFromHistory(e, item)}
                          title="Удалить из истории"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Правые иконки (Избранное и Корзина) */}
              <div className="header__icons">
                <div className="header__icon">
                  <Link href="/wishlist">
                    <img src="/heart.svg" alt="wishlist" className="header__icon-img" />
                  </Link>
                </div>
                <div className="header__icon">
                  <Link href="/cart">
                    <img src="/cart.svg" alt="cart" className="header__icon-img" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}