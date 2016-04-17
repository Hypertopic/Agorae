require 'spec_helper'

feature 'Search an item' do

  scenario 'by name' do
    visit $home_page
    click_on_link 'UV'
    click_on_link 'IF05 – Qualité du logiciel'
    expect(page).to have_content('Tests de recette automatisés')
  end

end
