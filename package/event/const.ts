export class EventBusEventName {
	static init = 'init'
	static first_render = 'first_render'
	static rerender = 'rerender'
	static draw = 'draw'
	static resize = 'resize'
	static scale = 'scale'

	static container_drag_enter = 'container_drag_enter'
	static container_drag_over = 'container_drag_over'
	static container_drag_leave = 'container_drag_leave'
	static container_drop = 'container_drop'

	static shape_delete = 'shape_delete'
	static shape_add = 'shape_add'
	static shape_after_render = 'shape_after_render'

	static selection_select_list_change = 'selection_select_list_change'
	static selection_action_click = 'selection_action_click'
}
