require 'spec_helper'

feature 'Edit UVs' do
  scenario 'from homepage' do
    visit '/'
    page.should have_content 'Cartographie des compétences'
    click_button 'OFF'
    click_on 'add'
  end
end
