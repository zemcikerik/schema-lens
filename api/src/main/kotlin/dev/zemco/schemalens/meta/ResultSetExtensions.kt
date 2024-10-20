package dev.zemco.schemalens.meta

import java.sql.ResultSet

fun ResultSet.getNullableInt(name: String): Int? = getInt(name).let { if (wasNull()) null else it }
