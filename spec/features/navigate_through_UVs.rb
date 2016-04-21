require 'spec_helper'

feature 'Navigate through UVs' do
  scenario 'from corpus' do
    visit '/'
    page.should have_content 'Cet espace numérique'
    click_on 'UV'
    click_on 'IF05 – Qualité du logiciel'
    page.should have_content 'IF05'
    page.should have_content 'Capybara'
    page.should have_content 'Aurélien Bénel'
  end

  scenario 'from Aptitudes principales' do
    visit '/'
    click_on 'Aptitudes principales'
    click_on 'Coordonner des développements en équipe'
    page.should have_content 'Thèmes'
    click_on 'GL02 – Fondements de l\'ingénierie logicielle (UV)'
    page.should have_content 'GL02 – Fondements de l\'ingénierie logicielle'
  end

end
