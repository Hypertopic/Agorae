require 'spec_helper'

feature 'Delete items' do

  $a_title = a_string()

  background do
    pending 'stay updated about article lifecycle'
    visit $home_page
    click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
    click_on_link 'UV'
    toggle_edit
    click_plus_sign_next_to 'item'
    edit_last 'item', $a_title
  end

  scenario 'To delete an item' do
    pending 'stay updated about article lifecycle'
    visit $home_page
	click_on 'Se connecter'
    log_in_as 'alice', 'lapinblanc'
    click_on_link 'UV'
    toggle_edit
    click_del_sign_next_to $a_title
    expect(page).not_to have_content($a_title)
  end

end
