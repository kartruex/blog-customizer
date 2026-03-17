import { useState, useRef, useEffect, FormEvent } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type TArticleParamsFormProps = {
	currentArticleState: ArticleStateType;
	setArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentArticleState,
	setArticleState,
}: TArticleParamsFormProps) => {
	// 1. Изменили название стейта
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [formState, setFormState] =
		useState<ArticleStateType>(currentArticleState);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// 2. Обновили проверку
		if (!isMenuOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				// 3. Обновили сеттер
				setIsMenuOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isMenuOpen]); // 4. Обновили массив зависимостей

	const handleFieldChange = (
		key: keyof ArticleStateType,
		value: OptionType
	) => {
		setFormState((prev) => ({ ...prev, [key]: value }));
	};

	const handleFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		setArticleState(formState);
	};

	const handleFormReset = () => {
		setFormState(defaultArticleState);
		setArticleState(defaultArticleState);
	};

	return (
		<div ref={rootRef}>
			{/* 5. Передали новые пропсы в кнопку */}
			<ArrowButton
				isOpen={isMenuOpen}
				onClick={() => setIsMenuOpen(!isMenuOpen)}
			/>
			{/* 6. Обновили класс для открытия сайдбара */}
			<aside
				className={clsx(styles.container, isMenuOpen && styles.container_open)}>
				<form className={styles.form} onSubmit={handleFormSubmit}>
					<Text as='h2' size={31} weight={800} uppercase>
						Настройки внешнего вида
					</Text>

					<Select
						title='шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(val) => handleFieldChange('fontFamilyOption', val)}
					/>

					<RadioGroup
						title='размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(val) => handleFieldChange('fontSizeOption', val)}
					/>

					<Select
						title='цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(val) => handleFieldChange('fontColor', val)}
					/>

					<Separator />

					<Select
						title='цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(val) => handleFieldChange('backgroundColor', val)}
					/>

					<Select
						title='ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
						onChange={(val) => handleFieldChange('contentWidth', val)}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='clear' onClick={handleFormReset} />
						<Button title='Применить' type='apply' htmlType='submit' />
					</div>
				</form>
			</aside>
		</div>
	);
};
